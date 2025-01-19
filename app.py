from flask import Flask, render_template, jsonify
import csv
import random

app = Flask(__name__)

def get_random_quiz():
    # Open the CSV file
    with open('static/dataset/sudoku.csv', 'r') as file:
        reader = list(csv.reader(file))
        
    random_line = random.choice(reader)
    random_line = random_line[0]
    random_line = str(random_line)
    # Return the first part (the quiz)
    return random_line

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    random_quiz = get_random_quiz()
    return jsonify({'quiz': random_quiz})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
