define(["./models/user","sulusecurity/models/role","sulusecurity/models/permission","sulucontact/model/contact","./collections/roles","./models/userRole"],function(a,b,c,d,e,f){"use strict";return{name:"Sulu Contact Permissions",initialize:function(){"form"===this.options.display&&this.renderForm(),this.bindCustomEvents()},bindCustomEvents:function(){this.sandbox.on("sulu.user.permissions.save",function(a){this.save(a)}.bind(this)),this.sandbox.on("sulu.contacts.contacts.list",function(){this.sandbox.emit("sulu.router.navigate","contacts/contacts")},this),this.sandbox.on("sulu.user.permissions.delete",function(a){this.confirmDeleteDialog(function(b){if(b){var c=d.findOrCreate({id:a});this.sandbox.emit("sulu.header.toolbar.item.loading","options-button"),c.destroy({success:function(){this.sandbox.emit("sulu.router.navigate","contacts/contacts")}.bind(this)})}}.bind(this))},this),this.sandbox.on("sulu.user.activate",function(){this.enableUser()}.bind(this))},save:function(a){this.sandbox.emit("sulu.header.toolbar.item.loading","save-button"),this.user.set("username",a.user.username),this.user.set("contact",this.contact),this.user.set("locale",a.user.locale),this.user.set("email",a.user.email?a.user.email:null),a.user.password&&""!==a.user.password?this.user.set("password",a.user.password):this.user.set("password",""),this.sandbox.util.each(a.deselectedRoles,function(a,b){var c;this.user.get("userRoles").length>0&&(c=this.user.get("userRoles").findWhere({role:this.roles.get(b)}),c&&this.user.get("userRoles").remove(c))}.bind(this)),this.sandbox.util.each(a.selectedRolesAndConfig,function(a,b){var c,d=new f;this.user.get("userRoles").length>0&&(c=this.user.get("userRoles").findWhere({role:this.roles.get(b.roleId)}),c&&(d=c)),d.set("role",this.roles.get(b.roleId)),d.set("locales",b.selection),this.user.get("userRoles").add(d)}.bind(this)),this.user.save(null,{global:!1,success:function(a){this.sandbox.emit("sulu.user.permissions.saved",a.toJSON())}.bind(this),error:function(a,b){b&&b.responseJSON&&b.responseJSON.message&&(this.sandbox.emit("sulu.labels.error.show",this.gerErrorMessage(b.responseJSON.code),"labels.error",""),this.sandbox.emit("sulu.user.permissions.error",b.responseJSON.code))}.bind(this)})},gerErrorMessage:function(a){return 1004===a?"security.user.error.notUniqueEmail":1002===a?"security.user.error.missingPassword":1001===a?"security.user.error.notUnique":""},renderForm:function(){this.user=null,this.contact=null,this.options.id?this.loadRoles():this.sandbox.logger.log("error: form not accessible without contact id")},loadRoles:function(){this.roles=new e,this.roles.fetch({success:function(){this.loadUser()}.bind(this),error:function(){}})},loadUser:function(){this.user=new a,this.sandbox.util.load("/admin/api/users?contactId="+this.options.id).then(function(a){a&&a._embedded&&a._embedded.users&&a._embedded.users.length>0?(this.user.set(a._embedded.users[0]),this.contact=this.user.get("contact").toJSON(),this.startComponent()):this.loadContact()}.bind(this))},loadContact:function(){this.contact=new d({id:this.options.id}),this.contact.fetch({success:function(){this.contact=this.contact.toJSON(),this.startComponent()}.bind(this),error:function(){this.sandbox.logger.log("failed to load contact")}.bind(this)})},startComponent:function(){var a={},b=$('<div id="roles-form-container"/>');a.contact=this.contact,this.user&&(a.user=this.user.toJSON()),a.roles=this.roles.toJSON(),this.html(b),this.sandbox.start([{name:"permissions/components/form@sulusecurity",options:{el:b,data:a}}])},confirmDeleteDialog:function(a){if(a&&"function"!=typeof a)throw"callback is not a function";this.sandbox.emit("sulu.overlay.show-warning","sulu.overlay.be-careful","sulu.overlay.delete-desc",function(){a(!1)}.bind(this),function(){a(!0)}.bind(this))},enableUser:function(){var a=this.sandbox.data.deferred(),b="/admin/api/users/"+this.user.id+"?action=enable";return this.sandbox.util.save(b,"POST",{}).then(function(b){this.sandbox.logger.log("successfully enabled user",b),this.sandbox.emit("sulu.router.navigate","contacts/contacts/edit:"+this.user.attributes.contact.id+"/permissions",!0,!1,!0),a.resolve()}.bind(this)).fail(function(){a.reject()}.bind(this)),a}}});