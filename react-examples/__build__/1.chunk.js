webpackJsonp([1],{114:function(e,t){"use strict";function n(e,t){switch(void 0===e&&(e={loading:!1,message:"admin reducer was loaded via a chunk."}),t.type){case o:return r({},e,{loading:!0});case i:return r({},e,{loading:!1})}return e}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o="admin/LOADING",i="admin/LOADING_SUCCESS";n.load=function(){return function(e){e({type:o}),setTimeout(function(){return e({type:i})},2e3)}},e.exports=n},191:function(e,t,n){"use strict";var r=n(1),o=n(28),i=o.connect,a=n(114),u=a.load,s=function(e){return e.admin},l=r.createClass({displayName:"Admin",componentDidMount:function(){this.props.dispatch(u())},render:function(){var e=this.props,t=e.loading,n=e.message;return r.createElement("div",{className:"Admin"},r.createElement("h2",null,"Admin"),r.createElement("p",null,"This screen was loaded via a chunk."),r.createElement("p",null,n),t&&r.createElement("p",null,"Doing some fake loading…"))}});e.exports=i(s)(l)}});
//# sourceMappingURL=1.chunk.js.map