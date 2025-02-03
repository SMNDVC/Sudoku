from flask import Flask, render_template, jsonify
import csv
import random

app = Flask(__name__)

def get_random_quiz():
    with open('static/sudoku.csv', 'r') as file:
        reader = list(csv.reader(file))
        
    random_line = random.choice(reader)
    quiz, solution = random_line[0], random_line[1]
    return str(quiz), str(solution)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    quiz, solution = get_random_quiz()
    print('returning quiz')
    return jsonify({'quiz': quiz, 'solution': solution})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
