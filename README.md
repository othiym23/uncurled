Like curl, but does way less. Runs anywhere Node.js does.

```
Usage: uncurl [options...] <url>

Options:
  -i, --include  Include protocol headers in the output  [boolean]
  -X, --request  Specify request command to use          [string]  [default: "GET"]
  -d, --data     HTTP POST data                          [string]
```

`--data` works much like `curl` – a prefix of `@` indicates that the relevant
data should be streamed from the file path after the splat, and passing `-` as
the parameter to `--data` will read from standard input until EOF. Data will be
sent URL encoded.
