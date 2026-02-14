import HomeQuiz from '@/pages/home/home-quiz/HomeQuiz';
import HomeZoos from '@/pages/home/home-zoos/HomeZoos';
import HomeAnimals from '@/pages/home/home-animals/HomeAnimals';
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
