import { NavLink } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import './CardQuiz.css';

export default function CardQuiz() {
  return (
    <Card className="card-quiz">
      <div className="card-quiz-bg" />

      <div className="card-quiz-overlay" />

      <CardContent className="card-quiz-content">
        <h2>Quiz</h2>
        <p className="card-quiz-text">Découvrez quel animal est fait pour vous.</p>
      </CardContent>

      <CardFooter className="card-quiz-footer">
        <Button asChild variant="secondary">
          <NavLink to="/quiz">Lancer le quiz</NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
