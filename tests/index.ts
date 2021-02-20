console.log('success')

function options(value: any) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(value)
        console.log(target)
        console.log(propertyKey)
        console.log(descriptor)
    }
}