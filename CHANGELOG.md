# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/vinnoti/storas-backend/compare/v1.2.0...v1.2.1) (2020-06-05)


### Bug Fixes

* **transaction:** Add missing save() on reject verification ([#63](https://github.com/vinnoti/storas-backend/issues/63)) ([6d8c582](https://github.com/vinnoti/storas-backend/commit/6d8c582164159f91b36bf36ff961f47cbc686398))
* **transaction:** Adjust invalid state for cancelled payment ([#62](https://github.com/vinnoti/storas-backend/issues/62)) ([41185e5](https://github.com/vinnoti/storas-backend/commit/41185e528283cb237277baf4fc0b7367876fe8ba))
* **transaction:** Hackily convert to Asia/Jakarta Timezone ([#66](https://github.com/vinnoti/storas-backend/issues/66)) ([e98d705](https://github.com/vinnoti/storas-backend/commit/e98d705f48beeb63840bf4dc837bc796a64858d7))

## 1.1.0 (2020-05-30)


### Features

* **product:** Add ownedOnly filter on product list ([#60](https://github.com/vinnoti/storas-backend/issues/60)) ([f1385c1](https://github.com/vinnoti/storas-backend/commit/f1385c138ad65871b76afed788f4c242f26b7dba))


### Bug Fixes

* **transaction:** expose transaction detail to Admin ([#59](https://github.com/vinnoti/storas-backend/issues/59)) ([d28b85d](https://github.com/vinnoti/storas-backend/commit/d28b85d38b924f71df1e9a87c9ac53ddc11971fb))
* **transaction:** resolve invalid logic on Admin access control ([#61](https://github.com/vinnoti/storas-backend/issues/61)) ([65d41db](https://github.com/vinnoti/storas-backend/commit/65d41dbc14fbc5d1ebf75a0e96d0f776277e1493))


## 1.0.0 (2020-05-29)


### ⚠ BREAKING CHANGES

* **product, transaction:** Change lon to lng, fix response code (#51)
* **api-result:** Wrap api response data to result (#45)

### Features

* **asset:** Create upload asset API ([#43](https://github.com/vinnoti/storas-backend/issues/43)) ([81b592e](https://github.com/vinnoti/storas-backend/commit/81b592eb274441e742029cc0e9c93e789aa62f14))
* **payment:** Add API for payment veirification and some fixes ([#54](https://github.com/vinnoti/storas-backend/issues/54)) ([d5fbd1d](https://github.com/vinnoti/storas-backend/commit/d5fbd1d6d0e3586d75de7aa0e3b664488672a40e))
* **payment:** Add new payment destination entity, and remove hardcoded dst ([#57](https://github.com/vinnoti/storas-backend/issues/57)) ([755abc2](https://github.com/vinnoti/storas-backend/commit/755abc2a756b378c21c2751ff34f9c85bfac6dd0))
* **payment:** Add payment list to transaction detail API ([#55](https://github.com/vinnoti/storas-backend/issues/55)) ([f0291d2](https://github.com/vinnoti/storas-backend/commit/f0291d2a910a26fd172685c1eb8debceb0f7a436))
* **product:** Add description field ([#47](https://github.com/vinnoti/storas-backend/issues/47)) ([830a292](https://github.com/vinnoti/storas-backend/commit/830a2926cf9ed56e0c9f17ffb9c5bc71917d778c))
* **product:** Create upsert API ([#42](https://github.com/vinnoti/storas-backend/issues/42)) ([e9b5276](https://github.com/vinnoti/storas-backend/commit/e9b527691ddd24c1ef4a223551ae9759ab09c8ea))
* **transaction:** Add API for checkout product ([#48](https://github.com/vinnoti/storas-backend/issues/48)) ([2173e45](https://github.com/vinnoti/storas-backend/commit/2173e459b2fff4ca9094eb4f981347750d7310d8))
* **transaction:** Create submit payment API ([#49](https://github.com/vinnoti/storas-backend/issues/49)) ([bdd8b07](https://github.com/vinnoti/storas-backend/commit/bdd8b0748d473ab3f22ca5f3967c52654fc52f37))
* **transaction:** Impl for transaction detail and list API ([#41](https://github.com/vinnoti/storas-backend/issues/41)) ([3dfdb18](https://github.com/vinnoti/storas-backend/commit/3dfdb181e4018d7c769af55c5dbc9e7e608fb1d8))
* Add product seeder ([#40](https://github.com/vinnoti/storas-backend/issues/40)) ([d092339](https://github.com/vinnoti/storas-backend/commit/d092339691d2887559daa942c90b0eceb3848028))


### Bug Fixes

* **config:** Change staging sequelize config to environment variable ([#52](https://github.com/vinnoti/storas-backend/issues/52)) ([663ef8d](https://github.com/vinnoti/storas-backend/commit/663ef8dd7d8605b4cdde4fcd1d3c4bfdf2bac95c))
* **product:** Add missing description on upsert ([#50](https://github.com/vinnoti/storas-backend/issues/50)) ([0ebe4be](https://github.com/vinnoti/storas-backend/commit/0ebe4be034558772be2dc133825167f594a9aa36))
* **product:** Expose cityId ([#46](https://github.com/vinnoti/storas-backend/issues/46)) ([20f27ff](https://github.com/vinnoti/storas-backend/commit/20f27ff2e286e3497677e4971d72f5ca76781fa5))
* **transaction:** change verifyPayment access control to admin only ([#56](https://github.com/vinnoti/storas-backend/issues/56)) ([dd475dd](https://github.com/vinnoti/storas-backend/commit/dd475ddb4b9f0e2c865271e5fea4a7ee3bfa78b6))
* status-key-to-success-on-auth ([#44](https://github.com/vinnoti/storas-backend/issues/44)) ([6526151](https://github.com/vinnoti/storas-backend/commit/65261512932e209b63df440fcbd3ef540ef77121))


* **api-result:** Wrap api response data to result ([#45](https://github.com/vinnoti/storas-backend/issues/45)) ([9858478](https://github.com/vinnoti/storas-backend/commit/9858478223cdf9bb922afd49475024fbc54d301d))
* **product, transaction:** Change lon to lng, fix response code ([#51](https://github.com/vinnoti/storas-backend/issues/51)) ([1104674](https://github.com/vinnoti/storas-backend/commit/1104674b23a98d0b38a7478275e45a421c82954d))
