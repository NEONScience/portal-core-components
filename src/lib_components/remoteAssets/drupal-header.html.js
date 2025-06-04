let html;
export default html = `<header class="header" role="banner">
  <div class="header__inner l--offset-wide">
    <div class="header__logo">
  <a href="/" title="Home" rel="home"  id="block-neon-site-branding" class="logo">
    <img src="https://www.neonscience.org/themes/custom/neon/logo.svg" alt="NSF NEON, Operated by Battelle" class="logo__image">
  </a>
</div>

    <input type="checkbox" id="nav-trigger" class="nav-trigger js-mobile-nav-trigger" aria-label="Mobile Navigation Trigger" value="expanded" />
    <label for="nav-trigger">

      <svg class="nav-trigger__icon nav-trigger__icon--expand" xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18"><path d="M0 0h20v2H0V0zm0 16h20v2H0v-2zm0-8h20v2H0V8z"/></svg>

      <svg class="nav-trigger__icon nav-trigger__icon--collapse" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M1.636.222l14.142 14.142-1.414 1.414L.222 1.636 1.636.222zM.222 14.364L14.364.222l1.414 1.414L1.636 15.778.222 14.364z"/></svg>

    </label>
    <div class="authContainer">
              <div class="openid-connect-login-form" data-drupal-selector="openid-connect-login-form" id="block-openid-connect-login">
  
    
      <form action="/neon-assets/partial/header" method="post" id="openid-connect-login-form" accept-charset="UTF-8">
  <div>

<input data-drupal-selector="edit-openid-connect-client-auth0-login" type="submit" id="edit-openid-connect-client-auth0-login" name="auth0" value="Sign In" class="button js-form-submit form-submit button--search" />
</div><input autocomplete="off" data-drupal-selector="form-vzo9poyqyycqifeyn7ovcnak3kxguyfhvrx-caqikve" type="hidden" name="form_build_id" value="form-VZO9poyQyYcQIfEYn7oVCnAK3kxgUyFhvrX-CaQIKVE" />
<input data-drupal-selector="edit-openid-connect-login-form" type="hidden" name="form_id" value="openid_connect_login_form" />

</form>

  </div>

          </div>
    <div class="header__site-navigation">
      <div class="header__menu-main">
        <nav role="navigation" aria-labelledby="block-neon-main-menu-menu" id="block-neon-main-menu">
            
  <h2 class="visually-hidden" id="block-neon-main-menu-menu">Main navigation</h2>
  

        
          <ul  class="menu menu--main" data-depth="0">

              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/about" class="menu__link" title="About Us" data-plugin-id="menu-link-contentcf5cd374-1932-49b4-84fb-c84373c74a2e" data-drupal-link-system-path="node/8793">About Us</a>

          
                                        <button class='arrow visually-hidden focusable' tabindex='0' aria-label='Toggle Mega Menu'><svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 1L5 5 1 1' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg></button>

                            <div class='subNavWrapper'>
                            <div class='innerSubNavWrapper'>
            
                      <ul  class="menu menu--main" data-depth="1">

              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/about/overview" class="menu__link" data-plugin-id="menu-link-content6becd40c-e404-4c45-86a7-b9e351526149" data-drupal-link-system-path="node/10531">Overview</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/overview/design" class="menu__link" data-plugin-id="menu-link-contentdbaf57e6-8e09-4ced-8067-c328efcbd9d0" data-drupal-link-system-path="node/10532">Spatial and Temporal Design</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/overview/history" class="menu__link" data-plugin-id="menu-link-contenta6cad402-12cf-4d6d-8908-0f84d8fdcc32" data-drupal-link-system-path="node/19">History</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/visionandmanagement" class="menu__link" data-plugin-id="menu-link-content09549ac0-a6d6-4f7e-9b4c-9a627b5798ca" data-drupal-link-system-path="node/10533">Vision and Management</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/about/advisory-groups" class="menu__link" data-plugin-id="menu-link-content7d3b1161-a0d0-4e64-9379-8898b249458e" data-drupal-link-system-path="node/10534">Advisory Groups</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/advisory-groups/steac" class="menu__link" data-plugin-id="menu-link-content6e5092dc-969c-4d77-a18c-2b25b5f7a369" data-drupal-link-system-path="node/7563">Science, Technology &amp; Education Advisory Committee</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/advisory-groups/twgs" class="menu__link" data-plugin-id="menu-link-content60269894-fe67-449d-ae3c-b8e5c8332cd5" data-drupal-link-system-path="node/6273">Technical Working Groups (TWGs)</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/faq" class="menu__link" data-plugin-id="menu-link-content24eb36d5-b983-4f6a-9d28-f3bc10dba142" data-drupal-link-system-path="node/10545">FAQ</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/about/contact-us" class="menu__link" data-plugin-id="menu-link-content8af9dbd6-f100-467c-aedb-03e8436af553" data-drupal-link-system-path="node/24">Contact Us</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/contact-neon-biorepository" class="menu__link" data-plugin-id="menu-link-contentbd98cf22-22b2-4eb3-941b-0fbf2538f85e" data-drupal-link-system-path="node/14006">Contact NEON Biorepository</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/contact-us/field-offices" class="menu__link" data-plugin-id="menu-link-content4a00dcaf-25f1-4972-9011-197d08a6d57d" data-drupal-link-system-path="node/7874">Field Offices</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/user-accounts" class="menu__link" data-plugin-id="menu-link-content50646ee2-ea91-4cef-a399-301307b72524" data-drupal-link-system-path="node/8563">User Accounts</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/staff" class="menu__link" data-plugin-id="menu-link-content4abe0e55-92f6-4a6b-80f8-bbe802ba5df4" data-drupal-link-system-path="node/8802">Staff</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/neon-code-conduct" class="menu__link" data-plugin-id="menu-link-contentbc4a11ea-ed09-4faf-97e2-3d90fb4400ba" data-drupal-link-system-path="node/12759">Code of Conduct</a>

                  </li>
      
          </ul>
  

                          </div>

              <div class='subNavLabelWrapper'>
                <button class='subNavClose isDesktop' aria-label='Close Mega Menu'>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M.808 17.778L17.778.808l1.414 1.414-16.97 16.97-1.414-1.414z' fill='#fff'/><path d='M2.222.808l16.97 16.97-1.414 1.414L.808 2.222 2.222.808z' fill='#fff'/></svg>
                </button>
                <h3 class='isDesktop'>About Us</h3>
                <button class='mobileBack isMobile' aria-label='Back'>
                  <svg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9L1 5l4-4M1 5h12' stroke='#0073CF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                  </svg>
                </button>
              </div>
                            </div>

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-samples" class="menu__link" data-plugin-id="menu-link-contentf20b3a84-1e6a-4e28-8360-b1c56a8678de" data-drupal-link-system-path="node/1">Data &amp; Samples</a>

          
                                        <button class='arrow visually-hidden focusable' tabindex='0' aria-label='Toggle Mega Menu'><svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 1L5 5 1 1' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg></button>

                            <div class='subNavWrapper'>
                            <div class='innerSubNavWrapper'>
            
                      <ul  class="menu menu--main" data-depth="1">

              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data" class="menu__link" data-plugin-id="menu-link-contentb3fed72f-4451-475a-aaed-5afc65fa5b44" data-drupal-link-system-path="node/8858">Data Portal</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://data.neonscience.org/data-products/explore" class="menu__link" data-plugin-id="menu-link-content62e53c05-aea4-49ad-91fd-aeddc80edaaf">Explore Data Products</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/visualizations/data-availability" class="menu__link" data-plugin-id="menu-link-content29dc8755-cfe7-4699-ad73-972a8cc6aae6">Data Availability Charts</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data/spatial-data-maps" class="menu__link" data-plugin-id="menu-link-content28111453-dfce-423a-9b97-f10a8380f666" data-drupal-link-system-path="node/10547">Spatial Data &amp; Maps</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/documents" class="menu__link" data-plugin-id="menu-link-content6bf435ec-32c2-4d07-adee-9a53a9a8c82d">Document Library</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/data-api" class="menu__link" data-plugin-id="menu-link-content3b2666dd-02d1-4ad2-80ec-77a6c728dc30">API &amp; GraphQL</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/prototype-search" class="menu__link" data-plugin-id="menu-link-content304452f2-2aa7-4337-840e-904017a508a2">Prototype Data</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/web/external-lab-ingest" class="menu__link" data-plugin-id="menu-link-content22ee6087-e223-40f3-8b5d-bd64df368c00">External Lab Data Ingest (restricted)</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-samples/data-themes" class="menu__link" data-plugin-id="menu-link-content26671658-c210-44f9-befe-b80dc033466d" data-drupal-link-system-path="node/12907">Data Themes</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-themes/biogeochemistry-data-theme" class="menu__link" data-plugin-id="menu-link-content0e8a95c3-8f6b-4858-b5e0-f686f745deeb" data-drupal-link-system-path="node/12902">Biogeochemistry</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-themes/ecohydrology-data-theme" class="menu__link" data-plugin-id="menu-link-contente9046d57-e1b2-4966-bcec-4a048e4e37a9" data-drupal-link-system-path="node/12901">Ecohydrology</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-themes/land-cover-and-processes-data-theme" class="menu__link" data-plugin-id="menu-link-content23cfcfc3-675b-4819-aff8-010c1372b6e1" data-drupal-link-system-path="node/12900">Land Cover and Processes</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-themes/organismal-data-theme" class="menu__link" data-plugin-id="menu-link-contenta92082bc-534f-48c7-b67a-2c9edb91f3f9" data-drupal-link-system-path="node/12905">Organisms, Populations, and Communities</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/samples" class="menu__link" data-plugin-id="menu-link-content209fc9e1-01d3-4e02-8fc7-30ee57a8a644" data-drupal-link-system-path="node/10295">Samples &amp; Specimens</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/samples/find-samples" class="menu__link" data-plugin-id="menu-link-content3eb13091-f5c2-4504-907f-c08efdda5cf0" data-drupal-link-system-path="node/8174">Discover and Use NEON Samples</a>

          
            
                      <ul  class="menu menu--main" data-depth="3">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/samples/sample-types" class="menu__link" data-plugin-id="menu-link-content7417cb86-af57-40bc-a10a-0fde6834ef2b" data-drupal-link-system-path="node/6223">Sample Types</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/samples/sample-repositories" class="menu__link" data-plugin-id="menu-link-contentd05bcdf6-8970-4722-95b8-ca645e64e325" data-drupal-link-system-path="node/10907">Sample Repositories</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/sample-explorer" class="menu__link" data-plugin-id="menu-link-content5d5dbb38-d1af-4b96-a317-c3342c74824c">Sample Explorer</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/samples/soil-archive" class="menu__link" data-plugin-id="menu-link-contentdd42ebeb-0ce1-4e61-8a71-839b285a7f12" data-drupal-link-system-path="node/5">Megapit and Distributed Initial Characterization Soil Archives</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/samples/sample-processing" class="menu__link" data-plugin-id="menu-link-content6f36f01f-6050-4495-8443-fe8af82a0af3" data-drupal-link-system-path="node/10906">Sample Processing</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/samples/sample-quality" class="menu__link" data-plugin-id="menu-link-contentc518616f-d1e8-4e0a-bccf-879a487b9081" data-drupal-link-system-path="node/10908">Sample Quality</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/taxonomic-lists" class="menu__link" data-plugin-id="menu-link-content4a328a5d-d8ff-453c-9453-8d7d37240bbc">Taxonomic Lists</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection-methods" class="menu__link" data-plugin-id="menu-link-content72722bb5-d146-4d66-805f-0da30e1d5658" data-drupal-link-system-path="node/4776">Collection Methods</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/protocols-standardized-methods" class="menu__link" data-plugin-id="menu-link-content856ac830-91e7-4bd7-ae3b-0c63cfdcb05a" data-drupal-link-system-path="node/9">Protocols &amp; Standardized Methods</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/airborne-remote-sensing" class="menu__link" data-plugin-id="menu-link-content41b5a0e4-975c-4c08-a67c-0eca84b67ae6" data-drupal-link-system-path="node/3821">Airborne Remote Sensing</a>

          
            
                      <ul  class="menu menu--main" data-depth="3">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/flight-box-design" class="menu__link" data-plugin-id="menu-link-contenta003f4ab-bf95-433a-94c3-6e59c90d7106" data-drupal-link-system-path="node/10550">Flight Box Design</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/flight-schedules-coverage" class="menu__link" data-plugin-id="menu-link-content0ba93222-629e-45f6-b479-5aeaa7d7d83e" data-drupal-link-system-path="node/7871">Flight Schedules and Coverage</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/daily-flight-reports" class="menu__link" data-plugin-id="menu-link-content0be4facc-f958-4e94-aa01-44dad176c37c" data-drupal-link-system-path="node/10542">Daily Flight Reports</a>

          
            
                      <ul  class="menu menu--main" data-depth="4">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/aop-flight-report-sign" class="menu__link" data-plugin-id="menu-link-contentcf86300b-51b1-43cb-9da3-ded6764ec9e7" data-drupal-link-system-path="node/12625">AOP Flight Report Sign Up</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/camera" class="menu__link" data-plugin-id="menu-link-contenta4aeb31b-2767-4d82-8eea-fd8888bd5525" data-drupal-link-system-path="node/10554">Camera</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/imaging-spectrometer" class="menu__link" data-plugin-id="menu-link-contentcc70456b-b259-42c3-8223-4aacaa00bd99" data-drupal-link-system-path="node/10555">Imaging Spectrometer</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/lidar" class="menu__link" data-plugin-id="menu-link-content753af91d-f86f-495d-aea5-943db9660a98" data-drupal-link-system-path="node/10551">Lidar</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/automated-instruments" class="menu__link" data-plugin-id="menu-link-content393dc0bd-ecea-40be-a9b4-afcdfcc6c328" data-drupal-link-system-path="node/7819">Automated Instruments</a>

          
            
                      <ul  class="menu menu--main" data-depth="3">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/site-level-sampling-design" class="menu__link" data-plugin-id="menu-link-content995dbf4e-2526-45cb-ab26-02fafeef4410" data-drupal-link-system-path="node/10897">Site Level Sampling Design</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/sensor-collection-frequency" class="menu__link" data-plugin-id="menu-link-contentdb7f16d2-4eda-4635-baf9-88c1af6bdfdb" data-drupal-link-system-path="node/10901">Sensor Collection Frequency</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/instrumented-collection-types" class="menu__link" data-plugin-id="menu-link-content6e8e91a9-749e-4a1d-ac52-cf8f5c0a4cac" data-drupal-link-system-path="node/10900">Instrumented Collection Types</a>

          
            
                      <ul  class="menu menu--main" data-depth="4">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/meteorology" class="menu__link" data-plugin-id="menu-link-contentae197bf0-6135-4d43-8990-a41fde6675ec" data-drupal-link-system-path="node/7842">Meteorology</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/phenocams" class="menu__link" data-plugin-id="menu-link-contentb0dfe7f0-df08-488d-be4e-20f76ed7e1c6" data-drupal-link-system-path="node/7843">Phenocams</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/soil-sensors" class="menu__link" data-plugin-id="menu-link-contente166b818-4bb3-41b6-be3b-0a0e71db8e01" data-drupal-link-system-path="node/7841">Soil Sensors</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/groundwater" class="menu__link" data-plugin-id="menu-link-contentfece2347-9ab3-4022-b31c-00538a632df2" data-drupal-link-system-path="node/7839">Ground Water</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/surface-water" class="menu__link" data-plugin-id="menu-link-contente7ba717e-e605-43eb-b9c9-78ffda14eb5e" data-drupal-link-system-path="node/7840">Surface Water</a>

                  </li>
      
          </ul>
  

            

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/observational-sampling" class="menu__link" data-plugin-id="menu-link-contente6368031-4425-41eb-8ebc-b7b4ec924bc6" data-drupal-link-system-path="node/7820">Observational Sampling</a>

          
            
                      <ul  class="menu menu--main" data-depth="3">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-collection/observational-sampling/site-level-sampling-design" class="menu__link" data-plugin-id="menu-link-content4cd08be9-d90e-48b5-a91c-1eb81a59578c" data-drupal-link-system-path="node/10893">Site Level Sampling Design</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/sampling-schedules" class="menu__link" data-plugin-id="menu-link-content50896185-64ef-4054-95b0-1e34edf5b952" data-drupal-link-system-path="node/10889">Sampling Schedules</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/observation-types" class="menu__link" data-plugin-id="menu-link-content87627456-39bd-4415-a2f7-37c0f67bb854" data-drupal-link-system-path="node/10535">Observation Types</a>

          
            
                      <ul  class="menu menu--main" data-depth="4">

              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/aquatic-organisms" class="menu__link" data-plugin-id="menu-link-content516deb93-cdb1-4a2e-8f7b-63f9ad07197a" data-drupal-link-system-path="node/3277">Aquatic Organisms</a>

          
            
                      <ul  class="menu menu--main" data-depth="5">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/aquatic-microbes" class="menu__link" data-plugin-id="menu-link-contentcb276795-ec37-474d-8887-b210fb6dd14d" data-drupal-link-system-path="node/8113">Aquatic Microbes</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/fish" class="menu__link" data-plugin-id="menu-link-contentc4428d7f-47e9-4feb-a163-3c7962b703e6" data-drupal-link-system-path="node/7916">Fish</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/macroinvertebrates-zooplankton" class="menu__link" data-plugin-id="menu-link-content1f67c592-f211-472a-96d1-6d0afbb248b5" data-drupal-link-system-path="node/10538">Macroinvertebrates &amp; Zooplankton</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/algae-aquatic-plants" class="menu__link" data-plugin-id="menu-link-contentc70b3110-19fe-4dee-abb7-a348c764810f" data-drupal-link-system-path="node/8278">Periphyton, Phytoplankton, and Aquatic Plants</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/terrestrial-organisms" class="menu__link" data-plugin-id="menu-link-content16da5ab4-b9d0-4612-8434-71a2afee4c7a" data-drupal-link-system-path="node/3278">Terrestrial Organisms</a>

          
            
                      <ul  class="menu menu--main" data-depth="5">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/birds" class="menu__link" data-plugin-id="menu-link-content9342acc0-e692-4b29-bebd-146cf2b433ba" data-drupal-link-system-path="node/8288">Birds</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/ground-beetles" class="menu__link" data-plugin-id="menu-link-content0a1f0ff5-4341-4c61-b92f-017b804b6b42" data-drupal-link-system-path="node/8614">Ground Beetles</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/mosquitoes" class="menu__link" data-plugin-id="menu-link-content66719ba9-98af-4d53-92a7-9201af5ca78c" data-drupal-link-system-path="node/8290">Mosquitoes</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/small-mammals" class="menu__link" data-plugin-id="menu-link-content0d22c24a-b472-4081-98e0-3a7184da966c" data-drupal-link-system-path="node/8616">Small Mammals</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/soil-microbes" class="menu__link" data-plugin-id="menu-link-content34f31c97-846c-42b7-8240-68ffd6e5efb7" data-drupal-link-system-path="node/8617">Soil Microbes</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/terrestrial-plants" class="menu__link" data-plugin-id="menu-link-contentce579259-ccc5-4005-900e-8c90cea55807" data-drupal-link-system-path="node/8679">Terrestrial Plants</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/ticks" class="menu__link" data-plugin-id="menu-link-content729bc1f4-c6d2-4d44-8ac1-e16067e8c1d7" data-drupal-link-system-path="node/8615">Ticks</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/hydrology-geomorphology" class="menu__link" data-plugin-id="menu-link-content12e97bd1-71bc-49d3-9390-24f622275f1d" data-drupal-link-system-path="node/10536">Hydrology &amp; Geomorphology</a>

          
            
                      <ul  class="menu menu--main" data-depth="5">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/discharge" class="menu__link" data-plugin-id="menu-link-content7cd55886-f7db-4944-91ad-89d3944ea3c4" data-drupal-link-system-path="node/10537">Discharge</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/geomorphology" class="menu__link" data-plugin-id="menu-link-content93725a97-68b1-411b-95b0-4adf9ad53994" data-drupal-link-system-path="node/7917">Geomorphology</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/biogeochemistry" class="menu__link" data-plugin-id="menu-link-content8c562a22-0657-4d5e-a083-e0814b643517" data-drupal-link-system-path="node/7918">Biogeochemistry</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-collection/observational-sampling/observation-types/dna-sequences" class="menu__link" data-plugin-id="menu-link-contentabbb8f93-3191-4d4b-8a5f-2324c0e08d4b" data-drupal-link-system-path="node/7844">DNA Sequences</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/pathogens" class="menu__link" data-plugin-id="menu-link-content5f328874-83c5-48a4-bd73-9ad3df435a02" data-drupal-link-system-path="node/7881">Pathogens</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/sediments" class="menu__link" data-plugin-id="menu-link-contentb91b4188-9367-4c18-85a3-45e9c4d21c51" data-drupal-link-system-path="node/10541">Sediments</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-collection/soils" class="menu__link" data-plugin-id="menu-link-content2ebade6e-2943-484d-8866-56d9757209fa" data-drupal-link-system-path="node/10549">Soils</a>

          
            
                      <ul  class="menu menu--main" data-depth="5">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-collection/soils/soil-descriptions" class="menu__link" data-plugin-id="menu-link-contenta2ac2127-3b05-46dc-9f7b-099a70593074" data-drupal-link-system-path="node/11685">Soil Descriptions</a>

                  </li>
      
          </ul>
  

            

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/optimizing-observational-sampling-designs" class="menu__link" data-plugin-id="menu-link-content0f4cdaa4-35fa-40dd-9a25-61aa940a2d55" data-drupal-link-system-path="node/13121">Optimizing the Observational Sampling Designs</a>

                  </li>
      
          </ul>
  

            

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-notifications" class="menu__link" data-plugin-id="menu-link-content0f1ec38e-7c06-4dc1-a99b-49e9f5e77cea" data-drupal-link-system-path="node/10951">Data Notifications</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-samples/guidelines-policies" class="menu__link" data-plugin-id="menu-link-contentdfbf44da-4c25-48ab-83c6-1e7bcbd5e7f1" data-drupal-link-system-path="node/11642">Data Guidelines and Policies</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/guidelines-policies/citing" class="menu__link" data-plugin-id="menu-link-content5193b582-56f1-4a16-88ab-b20b999f65ba" data-drupal-link-system-path="node/11644">Acknowledging and Citing NEON</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/guidelines-policies/publishing-research-outputs" class="menu__link" data-plugin-id="menu-link-content7c82ebe4-ff75-4229-addb-f35f965575a9" data-drupal-link-system-path="node/11629">Publishing Research Outputs</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/guidelines-policies/usage-policies" class="menu__link" data-plugin-id="menu-link-content4492166d-5a94-4851-a5a8-0e9d65d5212b" data-drupal-link-system-path="node/11643">Usage Policies</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-samples/data-management" class="menu__link" data-plugin-id="menu-link-content514fa833-7231-4f27-9e3f-b881c6d5ad62" data-drupal-link-system-path="node/10557">Data Management</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-availability" class="menu__link" data-plugin-id="menu-link-content07b048fd-2232-4f71-89ad-42e109a79852" data-drupal-link-system-path="node/10298">Data Availability</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-formats-conventions" class="menu__link" data-plugin-id="menu-link-contentb975385f-187c-44fd-a034-2ce31ee3dd5f" data-drupal-link-system-path="node/10560">Data Formats and Conventions</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-processing" class="menu__link" data-plugin-id="menu-link-contentc507fd30-8d71-42e6-a7a4-f2ec0f15e0a5" data-drupal-link-system-path="node/8470">Data Processing</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-quality-program" class="menu__link" data-plugin-id="menu-link-content45f73191-e5d3-4e38-b12a-2930df20b176" data-drupal-link-system-path="node/10299">Data Quality</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-product-bundles" class="menu__link" data-plugin-id="menu-link-content2e410b73-dc7d-4b62-9e62-967a44257423" data-drupal-link-system-path="node/12601">Data Product Bundles</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/data-samples/data-management/data-revisions-releases" class="menu__link" data-plugin-id="menu-link-contentdc7e1b39-d62b-4195-8330-817b7ea7ba24" data-drupal-link-system-path="node/10559">Data Product Revisions and Releases</a>

          
            
                      <ul  class="menu menu--main" data-depth="3">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-revisions-releases/release-2021" class="menu__link" data-plugin-id="menu-link-contenta98b56f6-8338-4705-a65d-50183ad06567" data-drupal-link-system-path="node/11212">Release 2021</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-revisions-releases/release-2022" class="menu__link" data-plugin-id="menu-link-content506a226a-5ce3-4453-8b7a-b6094efed7c4" data-drupal-link-system-path="node/11956">Release 2022</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-revisions-releases/release-2023" class="menu__link" data-plugin-id="menu-link-content46256cea-0878-48a4-b4b5-038a432ce163" data-drupal-link-system-path="node/12583">Release 2023</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-revisions-releases/release-2024" class="menu__link" data-plugin-id="menu-link-content0b6be74a-0e52-4351-958f-f86a8092282b" data-drupal-link-system-path="node/13469">Release 2024</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/data-revisions-releases/release-2025" class="menu__link" data-plugin-id="menu-link-contenta7829319-b933-4330-b1ce-9851aea9ae65" data-drupal-link-system-path="node/14235">Release-2025</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/neon-google" class="menu__link" data-plugin-id="menu-link-contenteafa78df-0c09-46f2-878a-3ca0c433b462" data-drupal-link-system-path="node/12531">NEON and Google</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/data-samples/data-management/externally-hosted-data" class="menu__link" data-plugin-id="menu-link-content1c31d8a5-f543-4481-bc5c-b42102679e1c" data-drupal-link-system-path="node/10552">Externally Hosted Data</a>

                  </li>
      
          </ul>
  

            

                  </li>
      
          </ul>
  

                          </div>

              <div class='subNavLabelWrapper'>
                <button class='subNavClose isDesktop' aria-label='Close Mega Menu'>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M.808 17.778L17.778.808l1.414 1.414-16.97 16.97-1.414-1.414z' fill='#fff'/><path d='M2.222.808l16.97 16.97-1.414 1.414L.808 2.222 2.222.808z' fill='#fff'/></svg>
                </button>
                <h3 class='isDesktop'>Data &amp; Samples</h3>
                <button class='mobileBack isMobile' aria-label='Back'>
                  <svg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9L1 5l4-4M1 5h12' stroke='#0073CF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                  </svg>
                </button>
              </div>
                            </div>

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/field-sites" class="menu__link" data-plugin-id="menu-link-content8c902e85-3057-4872-8758-5191bb971f53" data-drupal-link-system-path="node/11376">Field Sites</a>

          
                                        <button class='arrow visually-hidden focusable' tabindex='0' aria-label='Toggle Mega Menu'><svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 1L5 5 1 1' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg></button>

                            <div class='subNavWrapper'>
                            <div class='innerSubNavWrapper'>
            
                      <ul  class="menu menu--main" data-depth="1">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/field-sites/about-field-sites" class="menu__link" data-plugin-id="menu-link-contentea521f61-7adb-4e1f-a373-08402b5538f8" data-drupal-link-system-path="node/6226">About Field Sites and Domains</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/field-sites/explore-field-sites" class="menu__link" data-plugin-id="menu-link-contente0a81e3e-ae32-43c7-85e9-2a643c7d0121" data-drupal-link-system-path="node/10899">Explore Field Sites</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/data-products/DP1.10111.001" class="menu__link" data-plugin-id="menu-link-content7c8d57da-a8ba-4c2e-a89f-ab71c319b33d">Site Management Data Product</a>

                  </li>
      
          </ul>
  

                          </div>

              <div class='subNavLabelWrapper'>
                <button class='subNavClose isDesktop' aria-label='Close Mega Menu'>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M.808 17.778L17.778.808l1.414 1.414-16.97 16.97-1.414-1.414z' fill='#fff'/><path d='M2.222.808l16.97 16.97-1.414 1.414L.808 2.222 2.222.808z' fill='#fff'/></svg>
                </button>
                <h3 class='isDesktop'>Field Sites</h3>
                <button class='mobileBack isMobile' aria-label='Back'>
                  <svg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9L1 5l4-4M1 5h12' stroke='#0073CF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                  </svg>
                </button>
              </div>
                            </div>

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/impact" title="Impact" class="menu__link" data-plugin-id="menu-link-content4878b38c-97fc-4a8b-9477-8e4ee7737dcc" data-drupal-link-system-path="node/8795">Impact</a>

          
                                        <button class='arrow visually-hidden focusable' tabindex='0' aria-label='Toggle Mega Menu'><svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 1L5 5 1 1' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg></button>

                            <div class='subNavWrapper'>
                            <div class='innerSubNavWrapper'>
            
                      <ul  class="menu menu--main" data-depth="1">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/impact/observatory-blog" class="menu__link" data-plugin-id="menu-link-content8a557196-631b-4be1-b9c5-120bc654861e" data-drupal-link-system-path="node/8857">Observatory Blog</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/impact/case-studies" class="menu__link" data-plugin-id="menu-link-content11c453ba-42f9-4e06-b17e-f57eb98caa04" data-drupal-link-system-path="node/10904">Case Studies</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/impact/papers-publications" class="menu__link" data-plugin-id="menu-link-contente7892e9f-e782-4116-8668-13b1ff946130" data-drupal-link-system-path="node/10915">Papers &amp; Publications</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/impact/newsroom" class="menu__link" data-plugin-id="menu-link-contenta37d89e0-5437-4f0f-8a94-76bb6f9de92c" data-drupal-link-system-path="node/10890">Newsroom</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/impact/newsroom/neon-news" class="menu__link" data-plugin-id="menu-link-content5781483e-2e3a-413b-8c02-0a5e6c88096a" data-drupal-link-system-path="node/6042">NEON in the News</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/impact/newsroom/newsletter-archive" class="menu__link" data-plugin-id="menu-link-content69db29a4-8a8b-4597-9f2e-3f19cf6db7ad" data-drupal-link-system-path="node/7826">Newsletter Archive</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/neon-newsletter-sign" class="menu__link" data-plugin-id="menu-link-content4c3d8b65-97ca-4671-9162-c8f3b6b3b76a" data-drupal-link-system-path="node/12590">Newsletter Sign Up</a>

                  </li>
      
          </ul>
  

            

                  </li>
      
          </ul>
  

                          </div>

              <div class='subNavLabelWrapper'>
                <button class='subNavClose isDesktop' aria-label='Close Mega Menu'>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M.808 17.778L17.778.808l1.414 1.414-16.97 16.97-1.414-1.414z' fill='#fff'/><path d='M2.222.808l16.97 16.97-1.414 1.414L.808 2.222 2.222.808z' fill='#fff'/></svg>
                </button>
                <h3 class='isDesktop'>Impact</h3>
                <button class='mobileBack isMobile' aria-label='Back'>
                  <svg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9L1 5l4-4M1 5h12' stroke='#0073CF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                  </svg>
                </button>
              </div>
                            </div>

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/resources" class="menu__link" data-plugin-id="menu-link-contenta857cb6b-7d79-46c7-9be7-7c5f265721ae" data-drupal-link-system-path="node/6228">Resources</a>

          
                                        <button class='arrow visually-hidden focusable' tabindex='0' aria-label='Toggle Mega Menu'><svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 1L5 5 1 1' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg></button>

                            <div class='subNavWrapper'>
                            <div class='innerSubNavWrapper'>
            
                      <ul  class="menu menu--main" data-depth="1">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/getting-started-neon-data-resources" class="menu__link" data-plugin-id="menu-link-contentdc6470d9-df2c-4b92-bfb9-a95a1e18da53" data-drupal-link-system-path="node/11293">Getting Started with NEON Data &amp; Resources</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/resources/communication-resources" class="menu__link" data-plugin-id="menu-link-contentd816ca2b-6706-4aa4-b4ae-6baaf730a0a1" data-drupal-link-system-path="node/6316">Documents and Communication Resources</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/impact/papers-publications" class="menu__link" data-plugin-id="menu-link-contente1679e42-20d4-4ab6-bf47-6ae19e3c9e5f" data-drupal-link-system-path="node/10915">Papers &amp; Publications</a>

                  </li>
              <li  class="menu__item">
          <a href="https://data.neonscience.org/documents" class="menu__link" data-plugin-id="menu-link-content1ffb7d51-3f5f-4272-9d13-9c693401801d">Document Library</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/communications-resources/outreach-materials" class="menu__link" data-plugin-id="menu-link-content0aaa9598-5e0d-4452-bec0-624658905ff7" data-drupal-link-system-path="node/10949">Outreach Materials</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/resources/code-hub" class="menu__link" data-plugin-id="menu-link-content4b099d06-3a5a-4bba-bbd9-ef4efc17094e" data-drupal-link-system-path="node/7076">Code Hub</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/code-hub/code-resources-guidelines" class="menu__link" data-plugin-id="menu-link-contentef6dd417-2373-4759-91dc-a24333963b93" data-drupal-link-system-path="node/8619">Code Resources Guidelines</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/code-hub/code-resources-submission" class="menu__link" data-plugin-id="menu-link-content50932777-6688-4cc1-81d2-e15feb8541cb" data-drupal-link-system-path="node/8631">Code Resources Submission</a>

                  </li>
              <li  class="menu__item">
          <a href="https://github.com/neonscience" class="menu__link" data-plugin-id="menu-link-contentb4fa71b6-2b86-42bb-a619-8948decccf4c">NEON&#039;s GitHub Organization Homepage</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/resources/learning-hub" class="menu__link" data-plugin-id="menu-link-contentcb7780e6-23a7-4605-b3da-c94c7a3b7de7" data-drupal-link-system-path="node/6136">Learning Hub</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/learning-hub/science-videos" class="menu__link" data-plugin-id="menu-link-content8743bdb2-0a55-458c-a8f8-965d84f52753" data-drupal-link-system-path="node/5345">Science Videos</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/learning-hub/tutorials" class="menu__link" data-plugin-id="menu-link-contentf590b3ea-79fe-499c-9647-979af5712923" data-drupal-link-system-path="node/10896">Tutorials</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/learning-hub/workshops-courses" class="menu__link" data-plugin-id="menu-link-content58e3b270-1d4e-47dd-932f-2c8b56514a51" data-drupal-link-system-path="node/6529">Workshops &amp; Courses</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/learning-hub/teaching-modules" class="menu__link" data-plugin-id="menu-link-content6ecaa3eb-6d78-4ec6-a4c9-2564154470db" data-drupal-link-system-path="node/10909">Teaching Modules</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/resources/research-support" class="menu__link" data-plugin-id="menu-link-content5af53ebb-9351-4942-989b-0c78514721c1" data-drupal-link-system-path="node/10764">Research Support Services</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/research-support/field-site-coordination" class="menu__link" data-plugin-id="menu-link-content8866c898-b4b5-4be2-b77e-610136832cfd" data-drupal-link-system-path="node/12209">Field Site Coordination</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/research-support/letters-support" class="menu__link" data-plugin-id="menu-link-content80c4026c-822d-4141-a0bd-62592e63a66e" data-drupal-link-system-path="node/8731">Letters of Support</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/research-support/mobile-deployment-platforms" class="menu__link" data-plugin-id="menu-link-content2bf78c84-4644-49a3-b954-16f26e60fa01" data-drupal-link-system-path="node/7751">Mobile Deployment Platforms</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/research-support/permits-permissions" class="menu__link" data-plugin-id="menu-link-contentc0988e1e-b17b-4967-97fc-6aa3139a9653" data-drupal-link-system-path="node/10769">Permits and Permissions</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/research-support/aop-flight-campaigns" class="menu__link" data-plugin-id="menu-link-contentd8d3542e-4dad-47e2-9f9b-3dc3657c8931" data-drupal-link-system-path="node/7754">AOP Flight Campaigns</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/research-support/research-support-faqs" class="menu__link" data-plugin-id="menu-link-content0020dd25-ba69-4a65-becb-0198653429db" data-drupal-link-system-path="node/11535">Research Support FAQs</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/research-support/nrss-projects" class="menu__link" data-plugin-id="menu-link-contentf54d6f1b-0ebf-46be-be4c-47c6de77c7fc" data-drupal-link-system-path="node/13119">Research Support Projects</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/resources/funding-opportunities" class="menu__link" data-plugin-id="menu-link-content67efc63f-fc52-491c-a9be-4b1c66225712" data-drupal-link-system-path="node/11327">Funding Opportunities </a>

                  </li>
      
          </ul>
  

                          </div>

              <div class='subNavLabelWrapper'>
                <button class='subNavClose isDesktop' aria-label='Close Mega Menu'>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M.808 17.778L17.778.808l1.414 1.414-16.97 16.97-1.414-1.414z' fill='#fff'/><path d='M2.222.808l16.97 16.97-1.414 1.414L.808 2.222 2.222.808z' fill='#fff'/></svg>
                </button>
                <h3 class='isDesktop'>Resources</h3>
                <button class='mobileBack isMobile' aria-label='Back'>
                  <svg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9L1 5l4-4M1 5h12' stroke='#0073CF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                  </svg>
                </button>
              </div>
                            </div>

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/get-involved" class="menu__link" data-plugin-id="menu-link-contentd5bd0f4f-d783-4405-b899-1e7680f1f88f" data-drupal-link-system-path="node/6753">Get Involved</a>

          
                                        <button class='arrow visually-hidden focusable' tabindex='0' aria-label='Toggle Mega Menu'><svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 1L5 5 1 1' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg></button>

                            <div class='subNavWrapper'>
                            <div class='innerSubNavWrapper'>
            
                      <ul  class="menu menu--main" data-depth="1">

              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/about/advisory-groups" class="menu__link" data-plugin-id="menu-link-content05c66823-e082-4444-a52e-dfba3e2a4396" data-drupal-link-system-path="node/10534">Advisory Groups</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/advisory-groups/steac" class="menu__link" data-plugin-id="menu-link-content2805ed89-40f1-468a-8114-e1ea19b4d0c6" data-drupal-link-system-path="node/7563">Science, Technology &amp; Education Advisory Committee</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/about/advisory-groups/twgs" class="menu__link" data-plugin-id="menu-link-content8badae4b-878e-4ed6-9369-27630c59049d" data-drupal-link-system-path="node/6273">Technical Working Groups</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/get-involved/upcoming-events" class="menu__link" data-plugin-id="menu-link-contente2867599-4e9d-41b9-8c7f-126d3a302d0b" data-drupal-link-system-path="node/10737">Upcoming Events</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/neon-ambassador-program" class="menu__link" data-plugin-id="menu-link-contentc7e5c1a7-f0e7-440e-a410-4aaca896b64b" data-drupal-link-system-path="node/11625">NEON Ambassador Program</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/workshop-series-exploring-neon-derived-data-products" class="menu__link" data-plugin-id="menu-link-contentf23464a6-0005-45c9-a8e8-65e44fd1f580" data-drupal-link-system-path="node/12804">Exploring NEON-Derived Data Products Workshop Series</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/research-and-collaborations" class="menu__link" data-plugin-id="menu-link-content7ad2b09c-c124-4a91-84b1-4b2ff93bd594" data-drupal-link-system-path="node/12059">Research and Collaborations</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/environmental-data-science-innovation-and-inclusion-lab" class="menu__link" data-plugin-id="menu-link-contenta0404736-a121-4da1-9e2b-6b29189a32a4" data-drupal-link-system-path="node/13683"> Environmental Data Science Innovation and Inclusion Lab</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/collaboration-doe-ber-user-facilities-and-programs" class="menu__link" data-plugin-id="menu-link-content0935ec96-6ac5-4e5c-8352-6af4e6678e90" data-drupal-link-system-path="node/13669">Collaboration with DOE BER User Facilities and Programs</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/efi-rcn-neon-ecological-forecasting-challenge" class="menu__link" data-plugin-id="menu-link-contentbece2b5c-bfc9-474f-b5f0-dc4d64a5bbf4" data-drupal-link-system-path="node/11363">EFI-NEON Ecological Forecasting Challenge</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/neon-great-lakes-user-group" class="menu__link" data-plugin-id="menu-link-content4c1299dd-fb77-413b-bb3d-547392ad3d6c" data-drupal-link-system-path="node/12371">NEON Great Lakes User Group</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/neon-science-summit" class="menu__link" data-plugin-id="menu-link-content34724630-c4b2-4c5f-a3b4-a956586c7f73" data-drupal-link-system-path="node/12057">NEON Science Summit</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/ncar-neon-community-collaborations" class="menu__link" data-plugin-id="menu-link-content2bc3207d-fc3c-4d83-a352-5842f74b01bf" data-drupal-link-system-path="node/11843">NCAR-NEON-Community Collaborations</a>

          
            
                      <ul  class="menu menu--main" data-depth="3">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/ncar-neon-community-steering-committee" class="menu__link" data-plugin-id="menu-link-content0cad2c2e-e83b-498c-aa34-4cc68ded2cb7" data-drupal-link-system-path="node/13474">NCAR-NEON Community Steering Committee</a>

                  </li>
      
          </ul>
  

            

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/get-involved/engagement" class="menu__link" data-plugin-id="menu-link-content32ac66ec-e6bb-4590-ad08-5c16f174f3b8" data-drupal-link-system-path="node/10556">Community Engagement</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/how-community-feedback-impacts-neon-operations" class="menu__link" data-plugin-id="menu-link-content5d01343d-0325-4607-9467-31626840164a" data-drupal-link-system-path="node/14028">How Community Feedback Impacts NEON Operations</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/science-seminars-and-data-skills-webinars" class="menu__link" data-plugin-id="menu-link-content72575261-4a4a-4e78-a936-2094fc3ba1c6" data-drupal-link-system-path="node/12373">Science Seminars and Data Skills Webinars</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/past-years-science-seminars-and-data-skills-webinars" class="menu__link" data-plugin-id="menu-link-contentbf68301d-8f19-4a9d-a118-5bac4657920d" data-drupal-link-system-path="node/12997">Past Years</a>

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/get-involved/work-opportunities" class="menu__link" data-plugin-id="menu-link-content01967027-b778-4bf5-ae89-7f0616c6ef68" data-drupal-link-system-path="node/6229">Work Opportunities</a>

          
            
                      <ul  class="menu menu--main" data-depth="2">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/get-involved/work-opportunities/careers" class="menu__link" data-plugin-id="menu-link-content74836b7c-6605-4053-8c60-433657412b9c" data-drupal-link-system-path="node/5198">Careers</a>

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/get-involved/work-opportunities/seasonal-fieldwork" class="menu__link" data-plugin-id="menu-link-contentb24e69ad-5745-49ca-8011-a426e1c8d741" data-drupal-link-system-path="node/6131">Seasonal Fieldwork</a>

                  </li>
              <li  class="menu__item menu__item--expanded">
          <a href="https://www.neonscience.org/get-involved/work-opportunities/internships" class="menu__link" data-plugin-id="menu-link-content3b6d3456-22c5-48b6-a553-c84e5535a0a9" data-drupal-link-system-path="node/16">Internships</a>

          
            
                      <ul  class="menu menu--main" data-depth="3">

              <li  class="menu__item">
          <a href="https://www.neonscience.org/get-involved/work-opportunities/internships/intern-alumni" class="menu__link" data-plugin-id="menu-link-content19e4645b-8092-4eb7-8ca2-8003844b6247" data-drupal-link-system-path="node/10553">Intern Alumni</a>

                  </li>
      
          </ul>
  

            

                  </li>
      
          </ul>
  

            

                  </li>
              <li  class="menu__item">
          <a href="https://www.neonscience.org/get-involved/partners" class="menu__link" data-plugin-id="menu-link-contentbbf150a7-d1e4-4cfa-a8b0-847989c52745" data-drupal-link-system-path="node/8094">Partners</a>

                  </li>
      
          </ul>
  

                          </div>

              <div class='subNavLabelWrapper'>
                <button class='subNavClose isDesktop' aria-label='Close Mega Menu'>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M.808 17.778L17.778.808l1.414 1.414-16.97 16.97-1.414-1.414z' fill='#fff'/><path d='M2.222.808l16.97 16.97-1.414 1.414L.808 2.222 2.222.808z' fill='#fff'/></svg>
                </button>
                <h3 class='isDesktop'>Get Involved</h3>
                <button class='mobileBack isMobile' aria-label='Back'>
                  <svg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9L1 5l4-4M1 5h12' stroke='#0073CF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                  </svg>
                </button>
              </div>
                            </div>

            

                  </li>
      
                      <li class="myAccount">
          <a href="/user/login" title="My Account" class="menu__link">My Account</a>
        </li>

                <li class="siteSearch isDesktop">
          <a href="/search/site" title="Search" class="menu__link">Search</a>
        </li>
                <li class="siteSearch isMobile">
          
<div
  class="search-form-mobile isMobile"
  id="block-searchform-mobile"
  role="search"
>
  

<div class="search-api-form" data-drupal-selector="search-api-form" id="block-searchform">
  
    
      <form action="/search/site" method="get" id="search-api-form" accept-charset="UTF-8">
  <div class="js-form-item form-item js-form-type-search form-item-title js-form-item-title form-no-label">
        <input title="Enter the terms you wish to search for." data-drupal-selector="edit-title" type="search" id="edit-title" name="title" value="" size="15" maxlength="128" placeholder="" class="form-search" />

        <label for="edit-title" class="visually-hidden">Search</label>
      </div>
<div data-drupal-selector="edit-actions" class="form-actions js-form-wrapper form-wrapper" id="edit-actions">

<input data-drupal-selector="edit-submit" type="submit" id="edit-submit" value="Search" class="button js-form-submit form-submit button--search" />
</div>

</form>

  </div>

</div>
        </li>
          </ul>
  


  </nav>

      </div>
    </div>
  </div>
  <div class="l--offset isDesktop header__search visually-hidden">
    <div class="header__search--inner">
        <h3 class="header__search--title">Search</h3>
        

<div class="search-api-form" data-drupal-selector="search-api-form" id="block-searchform">
  
    
      <form action="/search/site" method="get" id="search-api-form" accept-charset="UTF-8">
  <div class="js-form-item form-item js-form-type-search form-item-title js-form-item-title form-no-label">
        <input title="Enter the terms you wish to search for." data-drupal-selector="edit-title" type="search" id="edit-title" name="title" value="" size="15" maxlength="128" placeholder="" class="form-search" />

        <label for="edit-title" class="visually-hidden">Search</label>
      </div>
<div data-drupal-selector="edit-actions" class="form-actions js-form-wrapper form-wrapper" id="edit-actions">

<input data-drupal-selector="edit-submit" type="submit" id="edit-submit" value="Search" class="button js-form-submit form-submit button--search" />
</div>

</form>

  </div>

        <div class="header__search-close">
          <button aria-label="Close Search" class="button__search-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.808 17.778L17.778.808l1.414 1.414-16.97 16.97-1.414-1.414z" fill="#0073CF"/><path d="M2.222.808l16.97 16.97-1.414 1.414L.808 2.222 2.222.808z" fill="#0073CF"/></svg>
          </button>

        </div>
    </div>
  </div>
          <div id="header__authentication-ui"></div>
  </header>



`;