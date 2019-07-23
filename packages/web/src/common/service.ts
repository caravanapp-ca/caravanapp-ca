interface ServiceInit {
  status: 'init';
}
interface ServiceLoading<T> {
  status: 'loading';
  payload?: T;
}
interface ServiceLoaded<T> {
  status: 'loaded';
  payload: T;
}
interface ServiceError {
  status: 'error';
  error: Error;
}
export type Service<T> =
  | ServiceInit
  | ServiceLoading<T>
  | ServiceLoaded<T>
  | ServiceError;
