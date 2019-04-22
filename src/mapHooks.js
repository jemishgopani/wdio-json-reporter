module.exports = function (suiteHooks) {
    let hooks = []
    for (let hookName of Object.keys(suiteHooks)) {
        const hook = suiteHooks[hookName]
        let hookResult = {}

        hookResult.start = hook.start
        hookResult.end = hook.end
        hookResult.duration = hook._duration
        hookResult.title = hook.title
        hookResult.associatedSuite = hook.parent
        hookResult.associatedTest = hook.currentTest
        hooks.push(hookResult)
    }
    return hooks
}
