/* FlareUI v1.0 */

/********* Clear Search **********/
function ClearSearch() {
    // Insert the clear icon
    $(".search-filter-wrapper").before("<span class='clear-icon' title='Clear search'>x</span>");

    // Function to update the right offset of the clear icon
    function updateClearIconPosition() {
        var submitWidth = $(".search-submit-wrapper").outerWidth() || 0;
        var filterWidth = $(".search-filter-wrapper").is(":visible") ? $(".search-filter-wrapper").outerWidth() : 0;
        var totalOffset = submitWidth + filterWidth;

        $(".clear-icon").css("right", totalOffset + "px");
    }

    // Initial position update
    updateClearIconPosition();

    // Update position on window resize (in case widths change)
    $(window).on("resize", updateClearIconPosition);

    // Handle showing/hiding of clear icon
    var search_button = setInterval(function() {
        if ($(".search-field").val().length > 0) {
            $(".clear-icon").show();
            $("ul#searchResultsDropdown").show();
        }
        clearInterval(search_button);
    }, 100);

    $(".search-field").keyup(function() {
        if ($(this).val().length == 0) {
            $(".clear-icon").hide();
            $("ul#searchResultsDropdown").hide();
        } else {
            $(".clear-icon").show();
            $("ul#searchResultsDropdown").show();
        }
        updateClearIconPosition(); // keep position updated on input changes too
    }).keyup();

    $(".clear-icon").click(function() {
        $(this).prev('input').val('').trigger('change').focus();
        $(".clear-icon").hide();
        $("ul#searchResultsDropdown").hide();
    });
};


/********* Exact Search **********/
function ExactSearch() {
	var checked = localStorage.getItem('exactSearch');
	var url = window.location.href;
	var query = url.substring(url.indexOf('=') + 1);
	var quote = '"' + query + '"';
	var index = url.indexOf('?q=') + 3;

	function isChecked() {
		var withQuote = url.substring(0, index) + quote;
		if (query.indexOf('%22') >= 0) {
			console.log('');
		} else {
			window.location.href = withQuote;
		}
	}
	if ((checked == null) || (checked == 'true') || (query.indexOf('%22') >= 0)) {
		$('#exact-search').prop('checked', true);
		localStorage.setItem('exactSearch', true);
	} else {
		$('#exact-search').prop('checked', false);
	}
	if ($('#exact-search').is(':checked')) {
		isChecked();
	}
	$('#exact-search').change(function() {
		if (!$('#exact-search').is(':checked')) {
			var q = (query.replace('%22', '')).replace('%22', '');
			var noQuote = url.substring(0, index) + q;
			window.location.href = noQuote;
			localStorage.setItem('exactSearch', false);
		}
		if ($('#exact-search').is(':checked')) {
			isChecked();
			localStorage.setItem('exactSearch', true);
		}
	});
}

/********* Searchable Tabs **********/
function Tabs() {
	if ($('ul.tabs').parents('.tab-container').length) {
		$('.tab-container ul.tabs li').click(function() {
			var tab_id = $(this).attr('data-tab');
			var $container = $(this).closest('.tab-container');
			$container.find('ul.tabs li, .tab-content').removeClass('current');
			$(this).addClass('current');
			$container.find('#' + tab_id).addClass('current');
		});
	} else {
		$('ul.tabs li').click(function() {
			var tab_id = $(this).attr('data-tab');
			$('ul.tabs li, .tab-content').removeClass('current');
			$(this).addClass('current');
			$('#' + tab_id).addClass('current');
		});
	}
	var tabTerm = setInterval(function() {
		var first_term = $('.SearchHighlight').first();
		var other_terms = $('.SearchHighlight').not(":first");
		if (first_term.parents('div.tab-content').length) {
			$('ul.tabs li, .tab-content').removeClass('current');
			first_term.parents('div.tab-content').addClass('current');
			var content_id = $('div.current').attr('id');
			$('ul.tabs li[data-tab=' + content_id + ']').addClass('current SearchHighlight');
			clearInterval(tabTerm);
		}
		if (first_term.parent('.tab-link').length) {
			var parent_element = first_term.parent('.tab-link');
			var data_tab = parent_element.attr('data-tab');
			$('ul.tabs li, .tab-content').removeClass('current');
			parent_element.addClass('current');
			$('.tab-content[id=' + data_tab + ']').addClass('current');
			clearInterval(tabTerm);
		}
		if (other_terms.parents('.tab-content').length) {
			var term_in_tab = $('.tab-content').find('span.SearchHighlight').first();
			$('ul.tabs li, .tab-content').removeClass('current');
			$('.tab-content').each(function() {
				var el = $(this);
				if (el.find('.SearchHighlight').length) {
					var id = el.attr('id');
					var first_tab = term_in_tab.parents('.tab-content').attr('id');
					$('.tab-content[id=' + first_tab + ']').addClass('current');
					$('ul.tabs li[data-tab=' + first_tab + ']').addClass('current');
					$('ul.tabs li[data-tab=' + id + ']').addClass('SearchHighlight');
					clearInterval(tabTerm);
				}
			});
		}
	}, 100);
	$(window).on('hashchange', function(e) {
		var hash = window.location.href;
		var bookmark = hash.substring(hash.indexOf('#') + 1);
		var anchor_id = $('a[name=' + bookmark + ']').parents('.tab-content').attr('id');
		$('ul.tabs li, .tab-content').removeClass('current');
		$('a[name=' + bookmark + ']').parents('.tab-content').addClass('current');
		$('ul.tabs li[data-tab=' + anchor_id + ']').addClass('current');
	});
	$('.remove-highlight-button').click(function() {
		$('.SearchHighlight').removeClass('SearchHighlight');
	});
}

/********* Inline Drop-Down **********/
function InlineDropDown() {
	$(".inline-head").addClass("closed");
	$("div.inline-body").each(function(index) {
		$(this).attr("id", index);
		$(".inline-head").eq(index).attr("id", index);
	});
	$(".inline-head").click(function() {
		var id = $(this).attr("id");
		$("div[id=" + id + "]").toggle(200);
		$(this).toggleClass("expand");
	});
	var ddTerm = setInterval(function() {
		$('.SearchHighlight').each(function(){
			var term_parent = $(this).parents('div.inline-body');
			if (term_parent.length)
			{
				var term_id = term_parent.attr("id");
				if (term_parent.css('display') == 'none')
				{
					$("span.inline-head[id =" + term_id + "]").click();
				}
				//$("span.inline-head[id =" + term_id + "]").wrap("<span class='SearchHighlight'></span>");
				clearInterval(ddTerm);
			}
		});
	}, 100);
}

/********* Back to Top Button (robust across responsive layouts) **********/
function BackToTop(selectors = []) {
  const defaultSelectors = ['.body-container', '.main-section .outer-row', 'body'];
  const targets = (selectors && selectors.length) ? selectors : defaultSelectors;

  // If button already exists, do nothing (prevents duplicate initialization)
  if (document.getElementById('backToTopBtn')) return;

  // Create button
  const btn = document.createElement('button');
  btn.id = 'backToTopBtn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = 'Top';
  document.body.appendChild(btn);

  // Track attached elements to avoid duplicate listeners
  const attached = new WeakSet();
  let windowListenerAttached = false;

  // Helper: get a numeric scrollTop for an element (or 0)
  const getScrollTop = (el) => {
    try {
      if (!el) return 0;
      // For document scrolling, prefer pageYOffset
      if (el === window || el === document) return window.pageYOffset || document.documentElement.scrollTop || 0;
      return el.scrollTop || 0;
    } catch (e) {
      return 0;
    }
  };

  // Update button visibility based on max scroll among observed targets and window
  const updateVisibility = () => {
    // Window scroll (covers html/documentElement switching)
    const windowScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

    // Element scrolls
    let maxScroll = windowScroll;
    observedElements.forEach(el => {
      const s = getScrollTop(el);
      if (s > maxScroll) maxScroll = s;
    });

    btn.style.display = maxScroll > 20 ? 'block' : 'none';
  };

  // Attach scroll listener to a DOM element (or window)
  const attachListener = (el) => {
    if (!el) return;
    // When using WeakSet, window must be an Object, which it is
    if (attached.has(el)) return;
    attached.add(el);

    // For window, use window.addEventListener
    if (el === window) {
      if (!windowListenerAttached) {
        window.addEventListener('scroll', updateVisibility, { passive: true });
        windowListenerAttached = true;
      }
      return;
    }

    // For document (documentElement/body), attach to window as well for cross-browser
    if (el === document || el === document.documentElement || el === document.body) {
      if (!windowListenerAttached) {
        window.addEventListener('scroll', updateVisibility, { passive: true });
        windowListenerAttached = true;
      }
      return;
    }

    // Regular element scroll
    el.addEventListener('scroll', updateVisibility, { passive: true });
    // If element uses overflow:auto/scroll but currently not scrollable, still ok — listener is harmless.
  };

  // Collect observed elements (Set used for iteration)
  const observedElements = new Set();

  // Find and attach all elements that match the configured selectors
  const discoverAndAttach = () => {
    targets.forEach(sel => {
      // querySelectorAll handles selector lists like "html, body"
      try {
        const nodeList = document.querySelectorAll(sel);
        nodeList.forEach(el => {
          if (!observedElements.has(el)) {
            observedElements.add(el);
            attachListener(el);
          }
        });
      } catch (e) {
        // ignore invalid selectors
      }
    });

    // Always attach to window to cover html/documentElement scrolling
    attachListener(window);
  };

  // Initial discovery
  discoverAndAttach();

  // Observe DOM mutations to catch dynamically added scroll containers
  const observer = new MutationObserver((mutations) => {
    // Lightweight: re-run discovery whenever child nodes change
    discoverAndAttach();
    // Also update visibility once observers may have changed
    updateVisibility();
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // Also handle resize (some layouts switch scroll containers on resize)
  let resizeTimeout = null;
  const onResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      discoverAndAttach();
      updateVisibility();
    }, 150);
  };
  window.addEventListener('resize', onResize);

  // Click behavior: scroll window and any observed elements to top
  btn.addEventListener('click', () => {
    // Scroll the window/document to top
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    // Scroll other potential containers to top
    observedElements.forEach(el => {
      try {
        if (el === window || el === document) return;
        if (typeof el.scrollTo === 'function') {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          el.scrollTop = 0;
        }
      } catch (e) { /* ignore */ }
    });
  });

  // Run an initial visibility check after a short delay (allow layout)
  setTimeout(updateVisibility, 100);
}

	
/********* Heading Bookmarks **********/
function HeadingBookmarks(selectors) {
    var elements = $(selectors);
    var bookmarkToScroll = null;

    elements.each(function () {
        var heading = $(this);
        heading.addClass("bookmark-hotspot");
        var b = heading.attr("id");
        var bookmarked = heading.find("a[name]");
        var bookmarkID = bookmarked.attr("name");
        var finalID = "";

        if (bookmarked.length) {
            finalID = bookmarkID;
            heading.attr("id", bookmarkID);
            heading.prepend("<a class='heading-link' id='" + bookmarkID + "' onClick='copyLink(\"" + bookmarkID + "\", event)' href='#'><div id='anchor-icon'>&#160;&#160;</div></a>");
            var magellan = heading.attr("data-magellan-target");
            bookmarked.remove();
            if (bookmarkID !== magellan) {
                $("ul.menu li a[href='#" + magellan + "']").attr("href", "#" + bookmarkID);
            }
        } else if (b !== undefined) {
            finalID = b;
            heading.prepend("<a class='heading-link' id='" + b + "' onClick='copyLink(\"" + b + "\", event)' href='#'><div id='anchor-icon'>&#160;&#160;</div></a>");
            var magellan = heading.attr("data-magellan-target");
            if (b !== magellan) {
                $("ul.menu li a[href='#" + magellan + "']").attr("href", "#" + b);
            }
        } else {
            finalID = heading.text()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/&/g, "-and-")
                .replace(/[^\w\-]+/g, "")
                .replace(/\-\-+/g, "-");
            heading.attr("id", finalID);
            heading.prepend("<a class='heading-link' id='" + finalID + "' onClick='copyLink(\"" + finalID + "\", event)' href='#'><div id='anchor-icon'>&#160;&#160;</div></a>");
        }

        // Capture hash to scroll after all processing
        if (window.location.hash === "#" + finalID) {
            bookmarkToScroll = finalID;
        }

        heading.find(".heading-link").click(function () {
            heading.addClass("active");
            setTimeout(function () {
                heading.removeClass("active");
            }, 700);
        });
    });

    // Scroll to hash manually after short delay
    if (bookmarkToScroll) {
        setTimeout(function () {
            var target = document.getElementById(bookmarkToScroll);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 300); // delay slightly to ensure layout is stable
    }
}

// Clipboard copy function
function copyLink(id, event) {
    event.preventDefault();
    var base = location.href.split("#")[0];
    navigator.clipboard.writeText(base + "#" + id).then(() => {
        console.log("Copied to clipboard!");
    }).catch(() => {
        console.error("Failed to copy link.");
    });
}



/********* Dynamic Thumbnails **********/
function Thumbnails(maxHeight, maxWidth) {
	$('#mc-main-content img').each(function() {
		var img = $(this);
		var width = img.width();
		var height = img.height();
		if (height > maxHeight || width > maxWidth) {
			var src = img.attr('src');
			img.wrap('<a class="MCPopupThumbnailLink MCPopupThumbnailPopup" href="' + src + '"><img class="MCPopupThumbnail img thumbnail-img" title="Click to enlarge" data-mc-width="' + width + '" data-mc-height="' + height + '" src="'+ src +'" tabindex=""></a>');
		}
	});
}

/********* Highlight Toggle **********/
function HighlightToggle(){
	$(".highlight-toggle-button").click(function(){
			$(".SearchHighlight").toggleClass("highlight-hidden");
			$(this).toggleClass("show-highlight");
	});
}

/********* Expandable Tables **********/
function ExpandTable(selector) {
	//find all tables on the page within the #mc-main-content-div
	$("#mc-main-content").find(selector).each(function(i){
		$(this).wrap("<div class='table-wrapper'></div>"); //wrap in div to control expand button
		$("<div class='expand-table'>Expand table</div>").insertBefore($(this)); //insert expand button above table in div
		$(this).attr("id", i); //add unique id to each table
		$(this).clone().attr("id", i).addClass("clone").appendTo("body").hide(); //clone table, append to bottom of body and hide
	});
	//loop through each cloned table
	$(".clone").each(function(){
		var id = $(this).attr("id"); //get id of each table
		$(this).wrap("<div id='tableModalWindow' value='"+id+"' class='table-modal'><div class='table-modal-content'></div></div>");//wrap cloned table in modal div and set value attribute to match id
		$(this).parents(".table-modal-content").prepend("<span class='close-table' title='Collapse table'>X</span>");//insert close button for modal
	})
	//handle click for expand button
	$(".expand-table").click(function(){
		var tableID = $(this).next().attr("id");//get id of table within the same parent div (closest table)
		$(".table-modal[value="+tableID+"]").show();//show modal containing correct cloned div
		$(".table-modal[value="+tableID+"]").find("table").show().css("width","100%");//show table and set width to 100% to fill the modal
		
		//prevent click inside modal from closing it
		$(".table-modal-content").click(function(event) {
				event.stopPropagation();
		});
		
		//handle click outside of modal to close the modal
		$("div.table-modal[value="+tableID+"]").click(function() {
				$(this).hide();
			});
			
		//handle close button click to close modal
		$("div.table-modal[value="+tableID+"] span.close-table").click(function() {
				$(this).closest(".table-modal").hide();
		});
	});
}

/********* Show More Menu Items **********/
function ShowMore(depth) {
	//$("div.menu-container").insertAfter("h1")[0];
    var maxIndex = $("._Skins_TopicMenu li.tree-node").length;
		$("ul._Skins_TopicMenu a").each(function(){
				if ($(this).is(":empty")){
					$(this).parent("li").remove();
				}
			});

    $("._Skins_TopicMenu li.tree-node").each(function(i) {
		if (i > 1) {
			$("div.menu-container").show();
		}
        if (i > depth) {
            $(this).hide();
            $(this).addClass("hidden");
            if (i === depth + 1) {
                $("._Skins_TopicMenu").append("<p class='show-more'></p>");
            }
        }
    });	
	
	if($("p.show-more").length){
		var numToShow = $("li.tree-node.hidden").length;
		$("p.show-more").text("Show " + numToShow + " more");
	}

    $("p.show-more").click(function() {
        $(".hidden").toggleClass("visible-list");
		$(".hidden").slideToggle("fast");
        if ($(".hidden").hasClass("visible-list")) {
            $(this).text("Show less");
        } else {
			var numToShow = $("li.tree-node.hidden").length;
            $(this).text("Show " + numToShow + " more");
        }
    });
}

/********* Reading Time **********/
function ReadingTime(wpm) {
	const topicText = document.querySelector('#mc-main-content').textContent;
	const wordCount = topicText.trim().split(/\s+/).length;
	const time = Math.ceil(wordCount / wpm);
	document.getElementById('read-time').innerText = time;
}

/********* Search Shortcut **********/
function SearchShortcut(code) {
	$(document).keydown(function(e) {
        if (e.keyCode == code && e.ctrlKey) {
            e.preventDefault();
            $(".search-field").focus();
        }
    });
}

/********* Scroll to first search term **********/
function ScrollToSearch(speed) {
    function scrollToFirstHighlight() {
        var firstHighlight = $('span.SearchHighlight').first();
        if (firstHighlight.length) {
            var scrollContainer = $('html, body, .body-container, .off-canvas-wrapper-inner .outer-row');

            if (scrollContainer.length) {
                var scrollPosition = firstHighlight.position().top + scrollContainer.scrollTop() - 50; 

                scrollContainer.animate({
                    scrollTop: scrollPosition
                }, speed);
            }
        } else {
            setTimeout(scrollToFirstHighlight, 200);
        }
    }

    scrollToFirstHighlight();

}

/********* Topic Popups for frameless outputs **********/
function TopicPopups() {
  // Append the popup modal to the body
  $("body").append(`
    <div class="popup-modal hidden-modal">
      <div class="popup-content">
        <button title="Close" class="close-btn">X</button>
        <iframe class="popup-iframe" frameborder="0"></iframe>
      </div>
    </div>
  `);

  // Detect if topic is inside an iframe and hide header and breadcrumbs
  if (window.self !== window.top) {
    // Hide elements inside the iframe
    $("nav.title-bar, .breadcrumbs, .topicToolbarProxy, .favorites-wrapper").hide(); 
  }

  // Handle click on popup-hotspot links
  $("a.popup-hotspot").on("click", function (e) {
    e.preventDefault();
    const href = $(this).attr("href");

    if (href) {
      // Set the iframe source and show the modal
      $(".popup-iframe").attr("src", href);
      $(".popup-modal").fadeIn();
    }
  });

  // Close the modal on close button click
  $(".close-btn").on("click", function () {
    $(".popup-modal").fadeOut(function () {
      // Clear the iframe src to stop loading
      $(".popup-iframe").attr("src", "");
    });
  });

  // Close the modal when clicking outside the content
  $(".popup-modal").on("click", function (e) {
    if ($(e.target).is(".popup-modal")) {
      $(".popup-modal").fadeOut(function () {
        $(".popup-iframe").attr("src", "");
      });
    }
  });
}
