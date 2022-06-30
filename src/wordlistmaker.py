lines = []
with open("dataset", "r") as f:
    for line in f:
        lines.append(line.strip("\n"))
import random
randomWords = []
while len(lines) != 0:
    word = random.choice(lines)
    randomWords.append(word)
    lines.remove(word)

randomWords
with open("WordList.js", "w") as f:
    f.write("export default function wordList() {\n")
    f.write("return ([\n")
    for word in randomWords:
        f.write(f"'{word}',\n")
    f.write("]);\n}")