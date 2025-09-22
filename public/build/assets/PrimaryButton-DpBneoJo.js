import{j as n}from"./app-DhyJwdg7.js";function j({className:t="",disabled:s,children:l,icon:e=null,rounded:r="rounded-xl",withShadow:u=!0,size:o="default",as:a="button",type:i="button",...c}){const b=o==="large"?"md:text-base":"",g=u?"shadow":"",x=e?n.jsx("i",{className:`fa-solid ${e}`}):null,m=o==="large"?"gap-2":"gap-1",p=/\bbg-/.test(t)?"":"bg-blue-500 hover:bg-blue-600",d=`
      flex items-center ${m} px-4 py-2 text-sm font-semibold text-white
      ${p} ${r} transition-all ${g} ${b}
      ${s?"opacity-70":""} ${t}
  `.trim(),f=a==="button"?{type:i}:{};return n.jsxs(a,{...f,...c,className:d,disabled:s,children:[x,l]})}export{j as P};
