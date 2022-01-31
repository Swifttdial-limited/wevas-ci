/*

Array of object

Top level object can be:
1. Header
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- Header ---/

header

/--- nav Grp ---/

title
icon (if it's on top level)
tag
tagVariant
children

/--- nav Item ---/

icon (if it's on top level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)
tag
tagVariant

*/
import dashboard from './dashboard'
import campaigns from './campaigns'
import addressbook from './addressbook'
import outbox from './outbox'
// import premium from './premium'
// import others from './others'
import senders from './senders'
import topups from './topups'
import inbox from './inbox'
import apikeys from './apikeys'

// Array of sections
export default [...dashboard, ...addressbook, ...campaigns, ...outbox, ...senders, ...topups, ...inbox, ...apikeys]
