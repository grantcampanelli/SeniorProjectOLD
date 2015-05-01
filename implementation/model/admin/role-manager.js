/** @author Michael Murphy */

var mongoose = require('mongoose');
var _ = require('underscore');

var MissingRoleException =  Error.bind(null, "No such role exception.");

function _findUserRoles(roles, user) {
   console.log('in _find user roles')
   console.dir(roles);
   throw new Error();
   var userId = user.id;
   function isMember(role) {
      return _.contains(role.users.map(String), userId);
   }
   return roles.filter(isMember);
}

function _findPermissionSet(roles) {
   function toPerms(role) {
      return role.permissions;
   }
   return _.union.apply(_, roles.map(toPerms));
}

function _getRole(roles, roleName) {
   return _.find(roles, function(role) {
      return role.name === roleName;
   });
}

//var roleSchema = mongoose.Schema({
//   name: String,
//   permissions: [String],
//   users: [{'type': mongoose.Schema.Types.ObjectId, 'ref': 'User'}]
//}, { _id: false });
//
//var roleManagerSchema = mongoose.Schema({
//   roles: [roleSchema]
//});
var roleManagerSchema = mongoose.Schema({
   roles: [{
      name: String,
      permissions: [String],
      users: [{'type': mongoose.Schema.Types.ObjectId, 'ref': 'User'}]
   }]
});

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
