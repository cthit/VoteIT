jest.autoMockOff();

var AcceptedUsersManager = require("../src/acceptedUsersManager");
require("../src/utils");

describe("AcceptedUsersManager", function () {
    describe("addToNotApprovedList", function () {
        it("a user should be able to be added to the not approved list", function () {
            var acceptedUsersManager = new AcceptedUsersManager();

            acceptedUsersManager.addToNotApprovedList("0");

            expect(acceptedUsersManager.usersNotApproved).toContain("0");
        });

        it("a user should not be able to be added twice to the not approved list", function () {
            var acceptedUsersManager = new AcceptedUsersManager();

            acceptedUsersManager.addToNotApprovedList("0");
            expect(function () {
                acceptedUsersManager.addToNotApprovedList("0");
            }).toThrow("0 has already been added to the not approved list");
        });

        it("a user should not be able to be added to not approved if they're already approved", function () {
            var acceptedUsersManager = new AcceptedUsersManager();

            acceptedUsersManager.addToNotApprovedList("0");
            acceptedUsersManager.approveUser("0");
            expect(function () {
                acceptedUsersManager.addToNotApprovedList("0");
            }).toThrow("0 is already approved");
        });
    });

    describe("approveUser", function () {
        it("a user needs to be on not approved before it can be approved", function () {
            var acceptedUsersManager = new AcceptedUsersManager();

            expect(function () {
                acceptedUsersManager.approveUser("0");
            }).toThrow("User has to be not approved before it can be approved");
        });

        it("if a user is on the not approved list, then it should be able to be approved", function () {
            var acceptedUsersManager = new AcceptedUsersManager();

            acceptedUsersManager.addToNotApprovedList("0");
            expect(acceptedUsersManager.usersNotApproved).toContain("0");
            expect(acceptedUsersManager.usersApproved.length).toBe(0);

            acceptedUsersManager.approveUser("0");
            expect(acceptedUsersManager.usersNotApproved.length).toBe(0);
            expect(acceptedUsersManager.usersApproved).toContain("0");
        });

        it("if multiple users is on the not approved list, then they should be able to be approved", function () {
            var acceptedUsersManager = new AcceptedUsersManager();

            acceptedUsersManager.addToNotApprovedList("0");
            acceptedUsersManager.addToNotApprovedList("1");
            acceptedUsersManager.approveUser("0");
            acceptedUsersManager.addToNotApprovedList("2");
            acceptedUsersManager.addToNotApprovedList("3");
            acceptedUsersManager.approveUser("2");
            acceptedUsersManager.addToNotApprovedList("4");
            acceptedUsersManager.approveUser("3");
            acceptedUsersManager.approveUser("1");
            acceptedUsersManager.approveUser("4");

            expect(acceptedUsersManager.usersApproved.length).toBe(5);
        });
    });
});
