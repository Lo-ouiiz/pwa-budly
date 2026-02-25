import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from './questions';
import type { Animal, Trait } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/lib/hooks/useUser';
import './AnimalQuiz.css';
import AnimalCard from '@/components/animal-card/AnimalCard';
import { API_BASE_URL } from '@/lib/constant';

const ANSWER_LETTERS = ['A', 'B', 'C', 'D'];

export default function AnimalQuiz() {
  const navigate = useNavigate();
  const { saveTraits } = useUser();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Partial<Record<Trait, number>>>({});
  const [selected, setSelected] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(false);

  const question = QUESTIONS[currentIdx];
  const isLast = currentIdx === QUESTIONS.length - 1;
  const isFirst = currentIdx === 0;
  const progress = (currentIdx / QUESTIONS.length) * 100;

  const handleAnswer = (answerIdx: number) => {
    const trait = question.answers[answerIdx].trait;
    const previousAnswerIdx = selected[currentIdx];
    const newScores = { ...scores };
    if (previousAnswerIdx !== null) {
      const previousTrait = question.answers[previousAnswerIdx].trait;
      newScores[previousTrait] = Math.max(0, (newScores[previousTrait] ?? 0) - 1);
    }
    newScores[trait] = (newScores[trait] ?? 0) + 1;
    const newSelected = [...selected];
    newSelected[currentIdx] = answerIdx;
    setScores(newScores);
    setSelected(newSelected);
  };

  const topTraits = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([trait, score]) => ({ trait: trait as Trait, score: score as number }));

  const handleFinish = async () => {
    setFinished(true);
    setLoadingAnimals(true);

    const traitNames = topTraits.map((t) => t.trait);
    await saveTraits(traitNames);

    const params = new URLSearchParams();
    traitNames.forEach((trait) => params.append('traits', trait));
    params.set('limit', '20');

    try {
      const res = await fetch(`${API_BASE_URL}/animals?${params.toString()}`);
      const data = await res.json();
      const sorted = (data.items ?? [])
        .map((animal: Animal) => ({
          animal,
          commonCount: animal.traits.filter((t) => traitNames.includes(t as Trait)).length,
        }))
        .sort(
          (a: { commonCount: number }, b: { commonCount: number }) => b.commonCount - a.commonCount,
        )
        .slice(0, 5)
        .map(({ animal }: { animal: Animal }) => animal);
      setAnimals(sorted);
    } catch {
      setAnimals([]);
    } finally {
      setLoadingAnimals(false);
    }
  };

  if (finished) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-results">
            <h1>Tes traits dominants</h1>
            <p className="quiz-results-desc">
              Voici les traits de personnalité qui te décrivent le mieux.
            </p>

            <div className="quiz-traits">
              {topTraits.map(({ trait }, i) => (
                <div key={trait} className="quiz-trait">
                  <span className="quiz-trait-rank">{i + 1} -</span>
                  <span className="quiz-trait-name">{trait}</span>
                </div>
              ))}
            </div>

            <div className="quiz-compatible">
              <h2 className="quiz-compatible-title">Les animaux qui te correspondent le mieux</h2>
              {loadingAnimals ? (
                <div className="quiz-compatible-list">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : animals.length === 0 ? (
                <p className="quiz-compatible-empty">Aucun animal trouvé.</p>
              ) : (
                <div className="quiz-compatible-list">
                  {animals.map((animal, index) => (
                    <AnimalCard
                      animal={animal}
                      showBadges={true}
                      isBest={index === 0}
                      key={`${index} - ${animal.name}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="quiz-actions">
              <Button
                onClick={() =>
                  navigate('/recherche', { state: { traits: topTraits.map((t) => t.trait) } })
                }
              >
                Voir d'autres animaux
              </Button>
              <Button variant="outline" onClick={() => setFinished(false)}>
                Retourner aux questions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <h1>Je découvre l'animal qui me correspond</h1>
        <div className="quiz-progress-header">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="quiz-counter">
            {currentIdx + 1}/{QUESTIONS.length}
          </span>
        </div>
        <div className="quiz-body" key={currentIdx}>
          <h2>{question.text}</h2>
          <div className="quiz-answers">
            {question.answers.map((answer, i) => (
              <button
                key={i}
                className={`quiz-answer ${selected[currentIdx] === i ? 'selected' : ''}`}
                onClick={() => handleAnswer(i)}
              >
                <span className="quiz-answer-letter">{ANSWER_LETTERS[i]}</span>
                <span className="quiz-answer-text">{answer.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="quiz-actions">
          {isLast ? (
            <Button disabled={selected[currentIdx] === null} onClick={handleFinish}>
              Découvrir mes animaux compatibles
            </Button>
          ) : (
            <Button
              disabled={selected[currentIdx] === null}
              onClick={() => setCurrentIdx((i) => i + 1)}
            >
              Question suivante
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => (isFirst ? navigate(-1) : setCurrentIdx((i) => i - 1))}
          >
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
