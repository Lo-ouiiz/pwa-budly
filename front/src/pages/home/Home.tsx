import HomeQuiz from '@/components/home-quiz/HomeQuiz';
import HomeZoos from '@/components/home-zoos/HomeZoos';
import HomeAnimals from '@/components/home-animals/HomeAnimals';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <HomeQuiz />
      <HomeAnimals />
      <HomeZoos />
    </div>
  );
}
