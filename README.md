# mazel

`mazel` is a slack application that extract elements randomly from candidates.

## Requirements

- latest stable Nodejs
- slack account

## Deployment

### Server

Only when you want to use your own server.
The procedure for deploying to [now.sh](https://zeit.co/now) as an example is described below.

1. Install now-cli

```console
$ npm install -g now
```

2. Login to now.sh

```console
$ now login
```

3. Deploy to now.sh

```console
$ now
```

### Slack

Set `mazel` as slash commands.
Set slash commands from the following URL.
https://my.slack.com/apps/new/A0F82E8CA-slash-commands

|Label|Value|
|-|-|
|Choose a Command|/mazel|
|URL|Your server address or https://mazel.now.sh|
|Method|GET|
|Customize Name|mazel|

## Usage

### Slash Command Syntax

```
/mazel [row:n] [column:n] candidates
```

|Parameter|Description|Example|Default Value|
|-|-|-|-|
|row|Number of rows|row:4|No limit|
|column|Number of columns|column:2|1|

#### Example

1. `/mazel foo bar baz qux quux corge grault garply waldo fred plugh xyzzy thud`

output

```
1: foo
2: baz
3: thud
4: garply
5: fred
6: xyzzy
7: corge
8: qux
9: quux
10: bar
11: waldo
12: plugh
13: grault
```

2. `/mazel column:5 foo bar baz qux quux corge grault garply waldo fred plugh xyzzy thud`

output

```
1: garply, plugh, quux, baz, bar
2: grault, fred, corge, xyzzy, qux
3: waldo, thud, foo
```

3. `/mazel row:3 column:2 foo bar baz qux quux corge grault garply waldo fred plugh xyzzy thud`

output

```
1: corge, xyzzy
2: grault, foo
3: garply, baz
```

## Contribution

1. Fork(https://github.com/unblee/mazel/fork)
2. Create a branch (`git checkout -b my-fix`)
3. Commit your changes (`git commit -am "fix something"`)
4. Push to the branch (`git push origin my-fix`)
5. Create a new [Pull Request](https://github.com/unblee/mazel/pulls)
6. Have a coffee break and wait

## Author

[unblee](https://github.com/unblee)

## License

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/unblee/mazel/blob/master/LICENSE)
