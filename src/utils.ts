import { IncomingMessage, ServerResponse, OutgoingHttpHeader, OutgoingHttpHeaders } from 'node:http'
import { ResposeCodes, SuccessCodes, UserID } from 'types'

export function success(res: ServerResponse, p: { status?: SuccessCodes; data: unknown }) {
  handleResponse(res, {
    status: p.status || 200,
    headers: { 'Content-Type': 'application/json' },
    data: p.data
  })
}

export function created(res: ServerResponse, p: { data: unknown }) {
  success(res, { status: 201, data: p.data })
}

export function badRequest(res: ServerResponse) {
  handleResponse(res, { status: 404 })
}

export function notFound(res: ServerResponse) {
  handleResponse(res, { status: 404 })
}

export function serverError(res: ServerResponse, errorMessage: unknown) {
  handleResponse(res, { status: 500, data: errorMessage })
}

function handleResponse(
  res: ServerResponse,
  p: { status: ResposeCodes; headers?: OutgoingHttpHeader[] | OutgoingHttpHeaders; data?: unknown }
) {
  res.writeHead(p.status, p.headers)

  if (p.data) {
    res.end(JSON.stringify(p.data))
  } else {
    res.end()
  }
}

export function parseReqParams(req: IncomingMessage) {
  let body = ''

  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (e) {
        reject(e)
      }
    })
  })
}

export function isUserRoute(url: string) {
  return url.match(/\/api\/users\/[\w\-\d]+/)
}

export function getUserIdFromUrl(url: string) {
  return url?.split('/')[3] as UserID
}
