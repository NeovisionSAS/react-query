import { XHRFetch } from '../client/xhr';

interface SharedTypes {
  [k: string]: string;
}

function Shared<T extends SharedTypes>(o: T): T {
  return Object.entries(o).reduce((p, [k, v]) => {
    return Object.assign(p, { [k]: v });
  }, {}) as T;
}

function Client<U = any, T extends SharedTypes = SharedTypes>(s: T) {
  return Object.entries(s).reduce((p, [k, v]) => {
    return Object.assign(p, {
      [k]: (data: U) => XHRFetch('url', { method: v }),
    });
  }, {}) as { [k in keyof T]: (d:U) => Promise<U> };
}

const UserShared = Shared({ getByName: 'GET' });
const UserClient = Client(UserShared);

UserClient.getByName()


class UserServer {}

// Client.add('getByName');

// const req = UserClient['getByName']('John');
