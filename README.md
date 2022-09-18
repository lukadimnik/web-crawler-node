# Wikipedia web crawler

## About

Web crawler built with typescript and node. The current version allows you to print a tree of links starting from the Wikipedia article of your choosing.

## How to run the script

1. Clone the project to your machine
2. Run `npm install`
3. Run `npm start [wiki topic] [depth of links] [first links followed]`

Example input:

```
npm start light 2 3
```

Example output:

```
light
    Light_(disambiguation)
      Light
      Light_bulb
      Traffic_light
    Visible_light_(disambiguation)
      Light
      Visible_spectrum
      Sunlight
    Dispersive_prism
      Prism
      Optics
      Prism
```
