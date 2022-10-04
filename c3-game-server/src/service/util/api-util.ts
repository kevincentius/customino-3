import { firstValueFrom, Observable } from "rxjs";
import { AxiosResponse } from 'axios';

// promisify axios response observable returned by generated code from OpenAPI.
export async function p<T>(observable: Observable<AxiosResponse<T>>): Promise<T> {
  return (await firstValueFrom(observable)).data;
}
