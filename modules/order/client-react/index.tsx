import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import { AuthRoute, IfLoggedIn } from '@gqlapp/user-client-react';
import resources from './locales';

import NavItemCart from './containers/NavItemCart.web';

const NavLinkOrdersWithI18n = translate('order')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/orders" className="nav-link" activeClassName="active">
    {'Orders'}
  </NavLink>
));

export default new ClientModule({
  route: [
    // <AuthRoute
    //   exact
    //   path="/orders"
    //   redirect="/profile"
    //   role="admin"
    //   component={loadable(() => import('./containers/Orders.web').then(c => c.default))}
    // />,
    <Route exact path="/order" component={loadable(() => import('./containers/Order').then(c => c.default))} />,
    <Route
      exact
      path="/checkout-cart"
      component={loadable(() => import('./containers/CheckoutCart.web').then(c => c.default))}
    />,
    <Route
      exact
      path="/checkout-bill"
      component={loadable(() => import('./containers/CheckoutBill.web').then(c => c.default))}
    />,
    <Route
      exact
      path="/checkout-pay"
      component={loadable(() => import('./containers/CheckoutPay.web').then(c => c.default))}
    />,
    <Route
      exact
      path="/checkout-order/:id"
      component={loadable(() => import('./containers/CheckoutOrder.web').then(c => c.default))}
    />
  ],
  navItemUser: [
    <MenuItem key="/checkout-cart">
      <NavLink to="/checkout-cart" className="nav-link" activeClassName="active">
        <NavItemCart />
      </NavLink>
    </MenuItem>
  ],
  navItemAdmin: [
    <IfLoggedIn key="/orders" role="admin">
      <MenuItem>
        <NavLinkOrdersWithI18n />
      </MenuItem>
    </IfLoggedIn>
  ],
  localization: [{ ns: 'order', resources }]
});
