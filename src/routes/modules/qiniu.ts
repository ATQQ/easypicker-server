import Router from '@/lib/router'

const router = new Router('qiniu')

router.get('/a/b/:id', (req, res) => {
    console.log(req.pathValue)
    console.log(req.query)
    console.log(req.data)
    res.success()
})

export default router
