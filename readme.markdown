jQuery Accessible Longdesc Plugin
=============================

making the Longdesc content available to users without assistive technologies

[demo](http://blog.ginader.de/dev/jquery/longdesc/examples/webaim/index.php)

The 3 images on the demo page each have a different longdesc attribute:

1. longdesc pointing to a page fragment: description.php#the-description (only that fragment will be loaded)
2. longdesc pointing to a page: description.php (the whole page will be loaded)
3. no longdesc attribute

known limitations:

1. breaks ie6 at the moment
2. the info icon we're using is not being displayed in any internet explorers (me might need to use an image after all)
3. only descriptions on the same server can be loaded due to the ajax same origin policy