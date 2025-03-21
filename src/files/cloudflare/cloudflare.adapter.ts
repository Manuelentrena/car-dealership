import { fileResponse } from '../contract';
import { CloudflareResponse } from './cloudfalre.interface';

export function adaptCloudflareResponse(
  response: CloudflareResponse,
): fileResponse {
  return {
    id: response.result.id,
    filename: response.result.filename,
    url: response.result.variants[0],
  };
}
