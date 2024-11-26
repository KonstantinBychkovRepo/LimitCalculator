import React, { useState } from 'react';
import './App.css';

function App() {
  const [sequence, setSequence] = useState('(n) => 1.0 / n');
  const [maxIterations, setMaxIterations] = useState(10000);
  const [tolerance, setTolerance] = useState(0.000001);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const calculateLimit = () => {
    setResult('');
    setError('');
    class LimitCalculator {

      constructor(tolerance = 1e-6, maxIterations = 10000) {
        this.tolerance = tolerance;
        this.maxIterations = maxIterations;
      }

      // Функция для вычисления приближенного значения предела последовательности
      calculateLimit(sequence) {
        let limit = 0;
        let epsilon = Infinity; // Наибольшая возможная погрешность
        let prevValue;

        try {
          prevValue = sequence(1);
        } catch (error) {
          return { limit: NaN, epsilon: NaN, type: "Ошибка: Неверная последовательность В n=1" };
        }

        for (let n = 2; n <= this.maxIterations; n++) {
          let currentValue;
          try {
            currentValue = sequence(n);
          } catch (error) {
            return { limit: NaN, epsilon: NaN, type: `Ошибка: Неправильное значение в n=${n}` };
          }

          let diff = Math.abs(currentValue - prevValue);

          if (diff < this.tolerance) {
            limit = currentValue;
            epsilon = diff;
            break;
          }
          // Проверка на конечность
          if (!Number.isFinite(currentValue)) {
            return this.checkLimitType(sequence, n); //Handle infinity cases more accurately
          }

          prevValue = currentValue;
        }
        return { limit, epsilon, type: "Конечный" };
      }


      checkLimitType(sequence, iterations) {
        const lastValue = sequence(iterations);
        if (lastValue === Infinity) return { limit: Infinity, epsilon: NaN, type: "+∞" };
        if (lastValue === -Infinity) return { limit: -Infinity, epsilon: NaN, type: "-∞" };
        if (!Number.isFinite(lastValue)) return { limit: NaN, epsilon: NaN, type: "∞" }; //Handles both + and - infinity
        return { limit: NaN, epsilon: NaN, type: "Конечное значение, стремящиеся к бесконечности" };
      }


    }

    try {
      const seqFunc = eval(`(${sequence})`); // Use eval cautiously; consider safer alternatives for production
      const calculator = new LimitCalculator(tolerance, maxIterations);
      const limitResult = calculator.calculateLimit(seqFunc);
      setResult(`Результат:
                 Предел: ${limitResult.limit}
                 Погрешность: ${limitResult.epsilon}
                 Тип предела: ${limitResult.type}`);
    } catch (error) {
      setError(`Ошибка: ${error.message}`);
    }
  };

  return (
      <div className="container">
        <h1>Калькулятор пределов последовательностей</h1>
        <div className="calculator">
          <div className="input-group">
            <label htmlFor="sequence">Формула последовательности:</label>
            <textarea
                id="sequence"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                rows="4"
                cols="50"
                placeholder="(n) => 1.0 / n"
            />
          </div>
          <div className="input-group">
            <label htmlFor="iterations">Максимальное количество итераций:</label>
            <input
                type="number"
                id="iterations"
                value={maxIterations}
                onChange={(e) => setMaxIterations(parseInt(e.target.value, 10))}
                min="1"
            />
          </div>
          <div className="input-group">
            <label htmlFor="tolerance">Точность (допуск):</label>
            <input
                type="number"
                id="tolerance"
                value={tolerance}
                onChange={(e) => setTolerance(parseFloat(e.target.value))}
                step="0.000001"
                min="0"
            />
          </div>
          <button onClick={calculateLimit}>Вычислить предел</button>
          <div className="result">{result}</div>
          <div className="error">{error}</div>
        </div>
      </div>
  );
}

export default App;