(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{67:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return d}));var a=n(2),i=n(6),r=(n(0),n(74)),o={title:"ZIO gRPC and Deadlines",description:"Setting deadlines with ZIO gRPC",custom_edit_url:"https://github.com/scalapb/zio-grpc/edit/master/docs/deadlines.md"},l={unversionedId:"deadlines",id:"deadlines",isDocsHomePage:!1,title:"ZIO gRPC and Deadlines",description:"Setting deadlines with ZIO gRPC",source:"@site/../zio-grpc-docs/target/mdoc/deadlines.md",slug:"/deadlines",permalink:"/zio-grpc/docs/deadlines",editUrl:"https://github.com/scalapb/zio-grpc/edit/master/docs/deadlines.md",version:"current",sidebar:"someSidebar",previous:{title:"Context and Dependencies",permalink:"/zio-grpc/docs/context"},next:{title:"Using with Scala.js",permalink:"/zio-grpc/docs/scala.js"}},s=[{value:"Setting timeout for all requests",id:"setting-timeout-for-all-requests",children:[]},{value:"Setting timeout for each request",id:"setting-timeout-for-each-request",children:[]}],c={rightToc:s};function d(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(r.b)("wrapper",Object(a.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"When you use a gRPC it is ",Object(r.b)("a",Object(a.a)({parentName:"p"},{href:"https://grpc.io/blog/deadlines/"}),"a very important to set deadlines"),".\nIn gRPC, deadlines are absolute timestamps that tell our system when the response of an RPC call is\nno longer needed. The deadline is sent to the server, and the computation is automatically interrupted\nwhen the deadline is exceeded. The client call automatically ends with a ",Object(r.b)("inlineCode",{parentName:"p"},"Status.DEADLINE_EXCEEDED")," error."),Object(r.b)("p",null,"When you don't specify a deadline, client requests never timeout. All in-flight requests take\nresources on the server, and possibly upstream servers, which can ultimately hurt latency or crash\nthe entire process."),Object(r.b)("p",null,"In ZIO gRPC you can easily set deadlines (absolute timestamps), or timeouts which are relative to\nthe time the outbound call is made."),Object(r.b)("h2",{id:"setting-timeout-for-all-requests"},"Setting timeout for all requests"),Object(r.b)("p",null,"To set the same timeout for all requests, it is possible to provide an effect that produces ",Object(r.b)("inlineCode",{parentName:"p"},"CallOptions"),"\nwhen constructing the client. This effect is invoked before each request, and can determine the deadline\nrelative to the system clock at the time the effect is executed."),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'import myexample.testservice.ZioTestservice.ServiceNameClient\nimport myexample.testservice.{Request, Response}\nimport scalapb.zio_grpc.{ZManagedChannel, SafeMetadata}\nimport io.grpc.ManagedChannelBuilder\nimport io.grpc.CallOptions\nimport java.util.concurrent.TimeUnit\nimport zio._\nimport zio.console._\n\nval channel = ZManagedChannel(\n  ManagedChannelBuilder\n    .forAddress("localhost", 8980)\n    .usePlaintext()\n)\n// channel: ZManagedChannel[Any] = zio.ZManaged$$anon$2@4b94e3a\n\n// create layer:\nval clientLayer = ServiceNameClient.live(\n  channel,\n  options=ZIO.effectTotal(\n    CallOptions.DEFAULT.withDeadlineAfter(3000, TimeUnit.MILLISECONDS)),\n  headers=SafeMetadata.make)\n// clientLayer: ZLayer[Any, Throwable, Has[ServiceNameClient.ZService[Any, Any]]] = Managed(\n//   zio.ZManaged$$anon$2@4e5e8679\n// )\n\nval myAppLogicNeedsEnv = for {\n  // use layer through accessor methods:\n  res <- ServiceNameClient.unary(Request())\n  _ <- putStrLn(res.toString)\n} yield ()\n// myAppLogicNeedsEnv: ZIO[Has[ServiceNameClient.ZService[Any, Any]] with Any with Console, io.grpc.Status, Unit] = zio.ZIO$FlatMap@6a6c51d5\n')),Object(r.b)("h2",{id:"setting-timeout-for-each-request"},"Setting timeout for each request"),Object(r.b)("p",null,"As in the previous example, assuming there is a client in the environment, we can set the timeout\nfor each request like this:"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"ServiceNameClient.withTimeoutMillis(3000).unary(Request())\n// res0: ZIO[Has[ServiceNameClient.ZService[Any, Any]] with Any, io.grpc.Status, Response] = zio.ZIO$Read@a52cc63\n")),Object(r.b)("p",null,"Clients provide (through the ",Object(r.b)("inlineCode",{parentName:"p"},"CallOptionsMethods")," trait) a number of methods that make it possible\nto specify a deadline or a timeout for each request:"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"// Provide a new absolute deadline\ndef withDeadline(deadline: Deadline): Service\n\n// Sets a new timeout for this service\ndef withTimeout(duration: zio.duration.Duration): Service\n\n// Sets a new timeout in millis\ndef withTimeoutMillis(millis: Long): Service\n\n// Replace the call options with the provided call options\ndef withCallOptions(callOptions: CallOptions): Service\n\n// Effectfully update the CallOptions for this service\ndef mapCallOptionsM(f: CallOptions => zio.IO[Status, CallOptions]): Service\n")),Object(r.b)("p",null,"If you are using a client instance, the above methods are available to provide you with a new\nclient that has a modified ",Object(r.b)("inlineCode",{parentName:"p"},"CallOptions")," effect. Making the copy of those clients is cheap and can\nbe safely done for each individual call:"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"val clientManaged = ServiceNameClient.managed(channel)\n// clientManaged: Managed[Throwable, ServiceNameClient.ZService[Any, Any]] = zio.ZManaged$$anon$2@44549b8d\n\nval myAppLogic = for {\n  res <- clientManaged.use(\n    client =>\n      client.withTimeoutMillis(3000).unary(Request())\n            .mapError(_.asRuntimeException)\n  )\n} yield res\n// myAppLogic: ZIO[Any with Any, Throwable, Response] = zio.ZIO$FlatMap@7e03a030\n")))}d.isMDXComponent=!0},74:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return h}));var a=n(0),i=n.n(a);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=i.a.createContext({}),d=function(e){var t=i.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=d(e.components);return i.a.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},m=i.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,o=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=d(n),m=a,h=p["".concat(o,".").concat(m)]||p[m]||u[m]||r;return n?i.a.createElement(h,l(l({ref:t},c),{},{components:n})):i.a.createElement(h,l({ref:t},c))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<r;c++)o[c]=n[c];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);