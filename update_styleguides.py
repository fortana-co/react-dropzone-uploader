import os


print('\nupdate styleguides')

with open('docs/quick-start.md', 'r') as infile:
    lines = infile.readlines()
with open('docs/quick-start.md', 'w') as f:
    for line in lines:
        if not line.startswith('<script'):
            f.write(line)
    for file in os.listdir('docs/assets/styleguide-quickstart/build'):
        if file.startswith('bundle') and file.endswith('.js'):
            f.write(f'<script type="text/javascript" src="./assets/styleguide-quickstart/build/{file}" async="true"></script>\n')
            path = f'docs/assets/styleguide-quickstart/build/{file}'
            with open(path, 'r') as script:
                text = script.read().replace('"build/"', '"assets/styleguide-quickstart/build/"')
            with open(path, 'w') as script:
                script.write(text)

with open('docs/examples.md', 'r') as infile:
    lines = infile.readlines()
with open('docs/examples.md', 'w') as f:
    for line in lines:
        if not line.startswith('<script'):
            f.write(line)
    for file in os.listdir('docs/assets/styleguide/build'):
        if file.startswith('bundle') and file.endswith('.js'):
            f.write(f'<script type="text/javascript" src="./assets/styleguide/build/{file}" async="true"></script>\n')
            path = f'docs/assets/styleguide/build/{file}'
            with open(path, 'r') as script:
                text = script.read().replace('"build/"', '"assets/styleguide/build/"')
            with open(path, 'w') as script:
                script.write(text)
