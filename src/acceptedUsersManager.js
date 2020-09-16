function AcceptedUsersManager() {
    this.usersApproved = [];
    this.usersNotApproved = [];
}

AcceptedUsersManager.prototype.addToNotApprovedList = function (userId) {
    if (this.usersNotApproved.includes(userId)) {
        throw userId + " has already been added to the not approved list";
    }

    if (this.usersApproved.includes(userId)) {
        throw userId + " is already approved";
    }

    this.usersNotApproved.push(userId);
};

AcceptedUsersManager.prototype.approveUser = function (userId) {
    var index = this.usersNotApproved.indexOf(userId);

    if (index === -1) {
        throw "User has to be not approved before it can be approved";
    }

    this.usersNotApproved.splice(index, 1);
    this.usersApproved.push(userId);
};

module.exports = AcceptedUsersManager;
