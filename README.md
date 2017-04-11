# homepage

### Step 1: prepare enviroment.

* install node.js, git, and so on.
* if you are making a develop enviroment, then set environment variable.
```
NODE_ENV=development
```

### Step 2: get source from github.
```
git clone https://github.com/mrm-xiefan/homepage-miraimon
```

### Step 3: install dependencies
```
cd homepage-miraimon
npm install
```

### Step 4: start service

* for test
```
node app.js
```

* for production(linux only)
```
nohup node app.js > /dev/null 2>&1 &
```
