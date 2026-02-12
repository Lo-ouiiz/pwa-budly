import HomeQuiz from '@/components/home-quiz/HomeQuiz';
import HomeZoos from '@/components/home-zoos/HomeZoos';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <HomeQuiz />
      <HomeZoos />
    </div>
  );
}
