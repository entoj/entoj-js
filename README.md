
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]

# entoj js support

## Running tests

Runs all test specs at once
```
npm test
```

Runs all test matching the given regex
```
npm test -- --grep model/
```

Enables logging while running tests
```
npm test -- --vvvv
```

Runs all test specs and shows test coverage
```
npm run coverage
```

Lints all source files
```
npm run lint
```

---

### Licence
[Apache License 2.0](LICENCE)

[travis-image]: https://img.shields.io/travis/entoj/entoj-js/master.svg?label=linux
[travis-url]: https://travis-ci.org/entoj/entoj-js
[appveyor-image]: https://img.shields.io/appveyor/ci/ChristianAuth/entoj-js/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/ChristianAuth/entoj-js
[coveralls-image]: https://img.shields.io/coveralls/entoj/entoj-js/master.svg
[coveralls-url]: https://coveralls.io/r/entoj/entoj-js?branch=master
