import CardQuiz from '@/components/card-quiz/CardQuiz';
import ZooPartnership from '@/components/zoo-partnership/ZooPartnership';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <CardQuiz />
      <ZooPartnership />
    </div>
  );
}
