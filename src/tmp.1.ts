function sleep(second: number, param: string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(param);
        }, second);
    })
}
async function test1() {
    let p1 = sleep(20000, 'req01');
    let p2 = sleep(1000, 'req02' + p1);
    let p3 = sleep(500, 'req03' + p2);
    await Promise.all([p1, p2, p3]);
    console.log('asdf');
}

test1();