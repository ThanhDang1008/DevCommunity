import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //return NextResponse.redirect(new URL('/home', request.url))
  console.log("-------------- middleware: ", request.url);

//   middleware:  {
//     cookies: RequestCookies {"session":{"name":"session","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoic2Vzc2lvbi0xNzQzNDA3ODk5MzA1LTkwOTcyNjY4MiIsImlhdCI6MTc0MzQwNzg5OSwiZXhwIjoxNzQ1OTk5ODk5fQ.UWq1c4YaWvM5GfkDIONrf1Z0POxhNiT8gVLM0dhoqfo"}}, 
//     nextUrl: {
//     href: 'http://localhost:8888/chu-de/kinh-doanh/tai-chinh',
//     origin: 'http://localhost:8888',
//     protocol: 'http:',
//     username: '',
//     password: '',
//     host: 'localhost:8888',
//     hostname: 'localhost',
//     port: '8888',
//     pathname: '/chu-de/kinh-doanh/tai-chinh',
//     search: '',
//     searchParams: URLSearchParams {  },
//     hash: ''
//   },
//     url: 'http://localhost:8888/chu-de/kinh-doanh/tai-chinh',
//     bodyUsed: false,
//     cache: 'default',
//     credentials: 'same-origin',
//     destination: '',
//     headers: {
//     accept: '*/*',
//     accept-encoding: 'gzip, deflate, br, zstd',
//     accept-language: 'vi,en-US;q=0.9,en;q=0.8',
//     connection: 'keep-alive',
//     cookie: 'session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoic2Vzc2lvbi0xNzQzNDA3ODk5MzA1LTkwOTcyNjY4MiIsImlhdCI6MTc0MzQwNzg5OSwiZXhwIjoxNzQ1OTk5ODk5fQ.UWq1c4YaWvM5GfkDIONrf1Z0POxhNiT8gVLM0dhoqfo',
//     host: 'localhost:8888',
//     next-url: '/chu-de/the-thao/bong-da-viet-nam',
//     referer: 'http://localhost:8888/chu-de/the-thao/bong-da-viet-nam',
//     sec-ch-ua: '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
//     sec-ch-ua-mobile: '?0',
//     sec-ch-ua-platform: '"Windows"',
//     sec-fetch-dest: 'empty',
//     sec-fetch-mode: 'cors',
//     sec-fetch-site: 'same-origin',
//     user-agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',  
//     x-forwarded-for: '::1',
//     x-forwarded-host: 'localhost:8888',
//     x-forwarded-port: '8888',
//     x-forwarded-proto: 'http'
//   },
//     integrity: '',
//     keepalive: false,
//     method: 'GET',
//     mode: 'cors',
//     redirect: 'follow',
//     referrer: 'about:client',
//     referrerPolicy: '',
//     signal: AbortSignal {
//     [Symbol(kEvents)]: SafeMap(0) {},
//     [Symbol(events.maxEventTargetListeners)]: 10,
//     [Symbol(events.maxEventTargetListenersWarned)]: false,
//     [Symbol(kHandlers)]: SafeMap(0) {},
//     [Symbol(kAborted)]: false,
//     [Symbol(kReason)]: undefined,
//     [Symbol(kComposite)]: false
//   }
//   }
  return NextResponse.next();
}
 
