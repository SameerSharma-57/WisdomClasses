// ..............  COUNTER  DESIGN .........

document.addEventListener("DOMContentLoaded" , () => {

		function counter(id, start, end, duration) {
			let obg = document.getElementByid(id),
			current = start,
			range = end - start,
			increment = end > start ? 1 : -1,
			step = math.abs (math.floor(duration / range )),
			timer = setinterval( () => {
				current+=increment;
				obj.textContent = current;
				if (current == end) {
					clearinterval(timer);
				} 
			}, step); 
		}

		counter("count1", 0, 1287, 3000);
		counter("count2", 100, 5786, 2500);
		counter("count3", 0, 1440, 3000);
		counter("count4", 0, 7110, 3000);


});

