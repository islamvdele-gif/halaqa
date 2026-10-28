# Собирает index.html в корне репозитория из _src/src.html: встраивает шрифты
# base64, чтобы сайт не зависел от внешних CDN. Запуск: python3 _src/build.py
import base64, pathlib
here = pathlib.Path(__file__).parent
fonts = here / 'fonts'
src = (here / 'src.html').read_text(encoding='utf-8')
for name in ['nunito700', 'nunito800', 'golos400', 'golos600', 'amiri700']:
    b64 = base64.b64encode((fonts / f'{name}.woff2').read_bytes()).decode()
    src = src.replace(f'FONT:{name}', 'data:font/woff2;base64,' + b64)
assert 'FONT:' not in src
head, body = src.split('<!--BODY-->')
head = '\n'.join(l for l in head.splitlines() if 'claude:viewport-fit-sides' not in l)
doc = ('<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       + head.strip() + '\n</head>\n<body>\n' + body.strip() + '\n</body>\n</html>\n')
(here.parent / 'index.html').write_text(doc, encoding='utf-8')
print('index.html', len(doc.encode()), 'байт')
