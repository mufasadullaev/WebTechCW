const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const content = req.body.content

    if (title.trim() === '' && description.trim() === '' && content.trim() === '') {
        res.render('create', { error: true })
    } else {
        fs.readFile('./data/blogs.json', (err, data) => {
            if (err) throw err

            const blogs = JSON.parse(data)

            blogs.push({
                id: id(),
                title: title,
                description: description,
                content: content,
            })

            fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err => {
                if (err) throw err

                res.render('create', { success: true })
            })
        })
    }
})

app.get('/blogs/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const updatedBlogs = blogs.filter(blog => blog.id !== id)

        fs.writeFile('./data/blogs.json', JSON.stringify(updatedBlogs), err => {
            if (err) throw err

            res.render('/blogs', { blogs: updatedBlogs, deleted: true })
        })
    })
})

app.get('/blogs/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id === id)[0]

        res.render('update', { blog: blog })
    })
})

app.post('/blogs/:id/update', (req, res) => {
    const id = req.params.id

    const title = req.body.title
    const description = req.body.description
    const content = req.body.content

    if (title.trim() === '' && description.trim() === '' && content.trim() === '') {
        res.render('update', { error: true })
    } else {
        fs.readFile('./data/blogs.json', (err, data) => {
            if (err) throw err

            const blogs = JSON.parse(data)

            const updatedBlogs = blogs.map(blog => {
                if (blog.id === id) {
                    return {
                        id: blog.id,
                        title: title,
                        description: description,
                        content: content,
                    }
                }
                return blog
            })

            fs.writeFile('./data/blogs.json', JSON.stringify(updatedBlogs), err => {
                if (err) throw err

                res.render('update', { success: true, blog: updatedBlogs.filter(blog => blog.id === id)[0] })
            })
        })
    }
})


app.get('/api/vp1/blogs', (req, res) => {
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.json(blogs)
    })
})

app.get('/blogs', (req, res) => {
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.render('blogs', { blogs: blogs })
    })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id === id)[0]

        res.render('blog-inner', { blog: blog })
    })
})

app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running on port 8000...')
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}