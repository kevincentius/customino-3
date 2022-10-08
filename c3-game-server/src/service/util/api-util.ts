import { firstValueFrom, Observable } from "rxjs";
import { AxiosResponse } from 'axios';

// promisify axios response observable returned by generated code from OpenAPI.
export async function p<T>(observable: Observable<AxiosResponse<T>>): Promise<T> {
  return new Promise((resolve, reject) => {
    firstValueFrom(observable)
      .then(axiosResponse => resolve(axiosResponse.data))
      .catch(reason => {
        console.trace(reason);
        reject(reason);
      });
  });
}
