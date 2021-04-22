Monad 要解决的问题： 对于多个嵌套的函子来说，如果要得到最后的值，则必须进行多次的解析(`_value()._value`)

造成多次解析的原因: 组合函数中的第一个函数返回了一个函子，然后把该函子返回给了第二个函数，第二个函数接受函子后又生成了一个函子，当执行 value() 时，第二个函子得以执行，但是执行结果是第一个函子，所以需要再次使用 value() 来获取第一个函子的值; 下面的案例中并没有使用 map方法，而是直接通过 return new IO(fn) 的方法来实现

monad 是如何解决的：monad 使用 flatMap(map().join()) 来结合函数，一旦执行完 map 后(也就是生成一个函子)直接通过 join 来执行该 value,导致整个结果始终只有最后一个完成的函子。也就是说，当每次 flatMap(xxx) 时，xxx都会收到一个函子，并且会新创建一个包着该函子的函数来生成新的函子，此时如果直接通过join来做一次处理后，就会直接得到值，假如这个值正好是返回的第一个函子时，则可以连续执行join来得到最终的值。

```javascript
    const fp = require('lodash/fp')
    const fs = require('fs')
    class IO {
        static of(value) {
            return new IO(function() {
                return value
            })
        }
        constructor(fn) {
            this._value = fn
        }

        map(fn) {
            return new IO(fp.flowRight(fn, this._value))
        }
    }

    // 使用IO函子读取文件(package.json)
    const readFile = function(fileName) {
        return new IO(function() {
            // 此处我们使用同步读取
            return fs.readFileSync(fileName, 'utf-8')
        })
    }

    const printV = function(v) {
        return new IO(function() {
            console.log(v)
            return v
        })
    }

    // 使用
    const cat = fp.flowRight(printV, readFile)
    const r = cat('package.json')
    console.log(r) // => IO { _value: [Function] }
    // 此时得到的r为：IO(IO(v)) 内部_value对应的[Function]返回结果就是io函子
    // 解析：
    // 1.flowRight组合了readFile和printV
    // 2.readFile返回的是一个io函子对象
    // 3.printV中的v是readFile返回的io函子
    // 4.所以printV中保存的值就是readFile返回的io函子
    // 5.因此cat得到的是执行readFile和printV之后的IO(IO(v))

    // 那我们如何获取到我们想要的最终的值呢？
    console.log(r._value()._value()) // => 输出package.json
    // 我们可以通过连续调用_value()方法获取到我们想要的，这用起来很不方便
    // 如何解决呢？Monad函子！
```


