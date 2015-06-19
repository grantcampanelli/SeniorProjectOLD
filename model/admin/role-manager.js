/**
 * Roll manager
 * @author Michael Murphy
 * @author Mike Ryu (JSDocs comments only)
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var MissingRoleException =  Error.bind(null, "No such role exception.");

/**
 * Given the roles and the user, returns the roles the user has.
 * @param roles roles
 * @param user user to find its assigned roles from
 * @returns {*}
 * @private
 */
function _findUserRoles(roles, user) {
   console.log('in _find user roles');
      console.dir(roles);
      throw new Error();
   var userId = user.id;

   /**
    * Returns <cc>true</cc> if the given user has
    * the given role, and <cc>false</cc> otherwise.
    * @param role role to check the user with
    */
   function isMember(role) {
      return _.contains(role.users.map(String), userId);
   }

   return roles.filter(isMember);
}

/**
 * Given the roles, finds the set of permissions assigned to the given roles.
 * @param roles roles to find the associated permissions from.
 * @private
 */
function _findPermissionSet(roles) {

   /**
    * Returns the array of permissions a given role has.
    * @param role role to find the set of permissions from
    * @returns {Array|Document.permissions}
    */
   function toPerms(role) {
      return role.permissions;
   }

   return _.union.apply(_, roles.map(toPerms));
}

/**
 * Finds the roles with the given name.
 * @param roles roles
 * @param roleName name to search roles with
 * @private
 */
function _getRole(roles, roleName) {
   return _.find(roles, function(role) {
      return role.name === roleName;
   });
}

var roleManagerSchema = mongoose.Schema({
   roles: [{
      name: String,
      permissions: [String],
      users: [{'type': mongoose.Schema.Types.ObjectId, 'ref': 'User'}]
   }]
}, {save: {w:1}, strict: false, safe: true});

roleManagerSchema.method('findAllUserIds', function() {
   function toUsers(role) {
      return role.users;
   }
   return _.uniq(_.flatten(this.roles.map(toUsers)).map(String), false);
});

roleManagerSchema.method('findUserIds', function(roleName) {
   var role = _getRole(this.roles, roleName);
   if (role) {
      return role.users;
   }
   return null;
});

roleManagerSchema.method('findUserRoles', function(user) {
   return _findUserRoles(this.roles, user).sort();
});

roleManagerSchema.method('findUserPermissions', function(user) {
   return _findPermissionSet(_findUserRoles(this.roles, user));
});

roleManagerSchema.method('findRolePermissions', function(roleName) {
   var role = _getRole(this.roles, roleName);
   if (role) {
      return role.permissions;
   }
   return null;
});

roleManagerSchema.method('isUserPermitted', function(user, perm) {
   var userRoles = _findUserRoles(this.roles, user);
   return _.contains(_findPermissionSet(userRoles), perm);
});

roleManagerSchema.method('grantRolePermission', function(roleName, perm) {
   var role = _getRole(this.roles, roleName);
   if (role) {
      role.permissions.addToSet(perm);
      return this;
   }
   throw new MissingRoleException();
});

roleManagerSchema.method('revokeRolePermission', function(roleName, perm) {
   var role = _getRole(this.roles, roleName);
   if (role) {
      role.permissions.remove(perm);
      return this;
   }
   throw new MissingRoleException();
});

roleManagerSchema.method('assignRole', function(roleName, user) {
   var role = _getRole(this.roles, roleName);
   if (role) {
      role.users.addToSet(user);
      return this;
   }
   throw new MissingRoleException();
});

roleManagerSchema.method('revokeRole', function(roleName, user) {
   var role = _getRole(this.roles, roleName);
   if (role) {
      role.users.remove(user.id);
      return this;
   }
   throw new MissingRoleException();
});

roleManagerSchema.method('addRole', function(roleName) {
   this.roles.addToSet({name: roleName});
   return this;
});

roleManagerSchema.method('removeRole', function(roleName) {
   this.roles.remove({name: roleName});
   return this;
});

module.exports = roleManagerSchema;
