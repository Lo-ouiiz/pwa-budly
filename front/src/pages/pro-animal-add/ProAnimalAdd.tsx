import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { API_BASE_URL } from '@/lib/constant';
import { authStore } from '@/lib/auth';
import type { Species, SubSpecies, Trait } from '@/lib/interfaces';
import { addAnimalSchema, type AddAnimalFormValues } from './animal-add-schema';
import { AutocompleteSelect } from '@/components/autocomplete-select/AutocompleteSelect';
import { useUser } from '@/lib/hooks/useUser';
import './ProAnimalAdd.css';

const TRAITS: Trait[] = [
  'Solitaire',
  'Sociable',
  'Affectueux',
  'Territorial',
  'Protecteur',
  'Indépendant',
  'Amical',
  'Curieux',
  'Paresseux',
  'Energique',
  'Joueur',
  'Endormi',
  'Timide',
  'Audacieux',
  'Colérique',
  'Calme',
  'Sensible',
  'Méfiant',
  'Joyeux',
  'Drôle',
  'Grognon',
  'Mystérieux',
  'Fier',
  'Arrogant',
  'Charmant',
  'Majestueux',
];

const CONSERVATION_STATUSES = [
  { value: 'NE', label: 'Non évalué' },
  { value: 'NA', label: 'Non applicable' },
  { value: 'DD', label: 'Données insuffisantes' },
  { value: 'LC', label: 'Préoccupation mineure' },
  { value: 'NT', label: 'Quasi menacé' },
  { value: 'VU', label: 'Vulnérable' },
  { value: 'EN', label: 'En danger' },
  { value: 'CR', label: 'En danger critique' },
  { value: 'RE', label: 'Disparu régionalement' },
  { value: 'EW', label: "Éteint à l'état sauvage" },
  { value: 'EX', label: 'Éteint' },
];

export default function ProAnimalAdd() {
  const { user } = useUser();
  const [errorMsg, setErrorMsg] = useState('');
  const [species, setSpecies] = useState<Species[]>([]);
  const [subSpecies, setSubSpecies] = useState<SubSpecies[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddAnimalFormValues>({
    resolver: zodResolver(addAnimalSchema),
    mode: 'onSubmit',
    defaultValues: { traits: [] },
  });

  const speciesIdValue = watch('speciesId');
  const selectedTraits = watch('traits') ?? [];
  const nameValue = watch('name');

  useEffect(() => {
    if (!nameValue || !user?.zooId) return;
    const slug =
      nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') +
      '-' +
      user.zooId;
    setValue('slug', slug, { shouldValidate: false });
  }, [nameValue, user?.zooId, setValue]);

  useEffect(() => {
    if (user?.zooId) setValue('zooId', user.zooId);
  }, [user?.zooId, setValue]);

  useEffect(() => {
    fetch(API_BASE_URL + '/species', {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data: Species[]) => setSpecies(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!speciesIdValue) {
      setSubSpecies([]);
      setValue('subSpeciesId', undefined);
      return;
    }
    fetch(API_BASE_URL + `/species/${speciesIdValue}/subspecies`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data: SubSpecies[]) => setSubSpecies(data))
      .catch(() => setSubSpecies([]));
  }, [speciesIdValue, setValue]);

  const toggleTrait = (trait: Trait) => {
    const current = selectedTraits as Trait[];
    const next = current.includes(trait) ? current.filter((t) => t !== trait) : [...current, trait];
    setValue('traits', next);
  };

  const onSubmit = async (data: AddAnimalFormValues) => {
    setErrorMsg('');
    try {
      const res = await fetch(API_BASE_URL + '/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ ...data, photos: [] }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la création de l'animal");
      }

      navigate('/pro/animaux');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const requiredLabel = (label: string) => (
    <>
      {label} <span className="pro-animal-add-required">*</span>
    </>
  );

  return (
    <section className="pro-animal-add-section">
      <div className="pro-animal-add-container">
        <h1 className="pro-animal-add-title">Ajouter un animal</h1>

        <form className="pro-animal-add-form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="pro-animal-add-section-title">Identité</h2>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="name">{requiredLabel('Nom')}</FieldLabel>
              <InputGroup>
                <InputGroupInput id="name" placeholder="Ex : Kira" {...register('name')} />
              </InputGroup>
              {errors.name && <span className="pro-animal-add-error">{errors.name.message}</span>}
            </Field>
          </div>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel>{requiredLabel('Espèce')}</FieldLabel>
              <Controller
                control={control}
                name="speciesId"
                render={({ field }) => (
                  <AutocompleteSelect
                    options={species}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    placeholder="Rechercher une espèce..."
                  />
                )}
              />
              {errors.speciesId && (
                <span className="pro-animal-add-error">{errors.speciesId.message}</span>
              )}
            </Field>

            <Field>
              <FieldLabel>Sous-espèce</FieldLabel>
              <Controller
                control={control}
                name="subSpeciesId"
                render={({ field }) => (
                  <AutocompleteSelect
                    options={subSpecies}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    placeholder="Rechercher une sous-espèce..."
                    disabled={!speciesIdValue}
                  />
                )}
              />
            </Field>
          </div>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="conservationStatus">
                {requiredLabel('Statut de conservation')}
              </FieldLabel>
              <select
                id="conservationStatus"
                className="pro-animal-add-select"
                {...register('conservationStatus')}
              >
                <option value="">Sélectionner</option>
                {CONSERVATION_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label} ({s.value})
                  </option>
                ))}
              </select>
              {errors.conservationStatus && (
                <span className="pro-animal-add-error">{errors.conservationStatus.message}</span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="gender">{requiredLabel('Genre')}</FieldLabel>
              <select id="gender" className="pro-animal-add-select" {...register('gender')}>
                <option value="">Sélectionner</option>
                <option value="MALE">Mâle</option>
                <option value="FEMALE">Femelle</option>
              </select>
              {errors.gender && (
                <span className="pro-animal-add-error">{errors.gender.message}</span>
              )}
            </Field>
          </div>

          <h2 className="pro-animal-add-section-title">Naissance et longévité</h2>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="birthDate">Date de naissance</FieldLabel>
              <InputGroup>
                <InputGroupInput id="birthDate" type="date" {...register('birthDate')} />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="birthPlace">Lieu de naissance</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="birthPlace"
                  placeholder="Ex : Tanzanie"
                  {...register('birthPlace')}
                />
              </InputGroup>
            </Field>
          </div>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="age">Âge</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="age"
                  type="number"
                  min={0}
                  placeholder="Ex : 5"
                  {...register('age', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                />
              </InputGroup>
              {errors.age && <span className="pro-animal-add-error">{errors.age.message}</span>}
            </Field>

            <Field>
              <FieldLabel htmlFor="lifeExpectancyYears">Espérance de vie (ans)</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="lifeExpectancyYears"
                  type="number"
                  min={0}
                  placeholder="Ex : 15"
                  {...register('lifeExpectancyYears', {
                    setValueAs: (v) => (v === '' ? undefined : Number(v)),
                  })}
                />
              </InputGroup>
              {errors.lifeExpectancyYears && (
                <span className="pro-animal-add-error">{errors.lifeExpectancyYears.message}</span>
              )}
            </Field>
          </div>

          <h2 className="pro-animal-add-section-title">Caractéristiques physiques</h2>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="weight">Poids (kg)</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="weight"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="Ex : 120"
                  {...register('weight', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                />
              </InputGroup>
              {errors.weight && (
                <span className="pro-animal-add-error">{errors.weight.message}</span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="size">Taille (cm)</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="size"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="Ex : 180"
                  {...register('size', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                />
              </InputGroup>
              {errors.size && <span className="pro-animal-add-error">{errors.size.message}</span>}
            </Field>
          </div>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="physicalSpecificity">Particularités physiques</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="physicalSpecificity"
                  placeholder="Ex : Cicatrice sur l'épaule gauche"
                  {...register('physicalSpecificity')}
                />
              </InputGroup>
            </Field>
          </div>

          <h2 className="pro-animal-add-section-title">Habitat et alimentation</h2>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="naturalHabitat">{requiredLabel('Habitat naturel')}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="naturalHabitat"
                  placeholder="Ex : Savane africaine"
                  {...register('naturalHabitat')}
                />
              </InputGroup>
              {errors.naturalHabitat && (
                <span className="pro-animal-add-error">{errors.naturalHabitat.message}</span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="diet">Régime alimentaire</FieldLabel>
              <InputGroup>
                <InputGroupInput id="diet" placeholder="Ex : Carnivore" {...register('diet')} />
              </InputGroup>
            </Field>
          </div>

          <h2 className="pro-animal-add-section-title">Description et histoire</h2>

          <div className="pro-animal-add-row">
            <Field>
              <FieldLabel htmlFor="description">{requiredLabel('Description')}</FieldLabel>
              <textarea
                id="description"
                className="pro-animal-add-textarea"
                placeholder="Décrivez l'animal..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <span className="pro-animal-add-error">{errors.description.message}</span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="story">Histoire</FieldLabel>
              <textarea
                id="story"
                className="pro-animal-add-textarea"
                placeholder="L'histoire de l'animal..."
                rows={4}
                {...register('story')}
              />
            </Field>
          </div>

          <h2 className="pro-animal-add-section-title">Personnalité</h2>

          <Field className="pro-animal-add-full">
            <FieldLabel>Traits de caractère</FieldLabel>
            <div className="pro-animal-add-traits">
              {TRAITS.map((trait) => (
                <button
                  key={trait}
                  type="button"
                  className={`pro-animal-add-trait-chip ${selectedTraits.includes(trait) ? 'selected' : ''}`}
                  onClick={() => toggleTrait(trait)}
                >
                  {trait}
                </button>
              ))}
            </div>
          </Field>

          {errorMsg && <span className="pro-animal-add-error pro-animal-add-full">{errorMsg}</span>}

          <div className="pro-animal-add-actions">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter l'animal</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
