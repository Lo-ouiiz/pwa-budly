import { NavLink } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import './CardQuiz.css';

export default function HomeQuiz() {
  return (
    <Card className="home-quiz">
      <div className="home-quiz-bg" />

      <div className="home-quiz-overlay" />

      <CardContent className="home-quiz-content">
        <h2 className="home-quiz-title">Quiz</h2>
        <p className="home-quiz-text">Découvrez quel animal est fait pour vous.</p>
      </CardContent>

      <CardFooter className="home-quiz-footer">
        <Button asChild variant="secondary">
          <NavLink to="/quiz">Lancer le quiz</NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
