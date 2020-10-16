const MapHooks = require("../src/mapHooks");
const hookStub = [
    {
        type: "hook",
        start: "2019-03-07T19:15:49.426Z",
        _duration: 1,
        uid: "hook-00-0",
        cid: "0-0",
        title: '"before each" hook',
        parent: "Sample Suite",
        errors: [
            {
                message: "expected 1 to equal 6",
                stack: "AssertionError: expected 1 to equal 6",
                type: "AssertionError",
                expected: 6,
                actual: 1,
            },
        ],
        end: "2019-03-07T19:15:49.427Z",
        state: "failed",
    },
    {
        type: "hook",
        start: "2019-03-07T19:15:49.437Z",
        _duration: 0,
        uid: "hook-00-2",
        cid: "0-0",
        title: '"after each" hook',
        parent: "Sample Suite",
        errors: [],
        end: "2019-03-07T19:15:49.437Z",
    },
];

describe("Tests to validate mapping hooks", () => {
    it("Should successfully map a hook", () => {
        const hookData = MapHooks(hookStub);

        expect(hookData).toHaveLength(2);
        expect(hookData[0]).toMatchObject({
            start: hookStub[0].start,
            end: hookStub[0].end,
            duration: hookStub[0]._duration,
            title: hookStub[0].title,
            associatedSuite: hookStub[0].parent,
            state: hookStub[0].state,
        });
        expect(hookData[1]).toMatchObject({
            start: hookStub[1].start,
            end: hookStub[1].end,
            duration: hookStub[1]._duration,
            title: hookStub[1].title,
            associatedSuite: hookStub[1].parent,
            state: "passed",
        });
    });
});
