
var allProducts = [];
var productId;




function fetchAllProducts(){
	fetch('https://test.clerenet.com/product')
	  .then(response => response.json())
	  .then(data => {
         	allProducts = data;
         	console.log(allProducts);
         	createRow();
	  });
}

function createProduct(){

	if ($("#add-name").val() != "" && $("#add-price").val() != "" && $("#add-currency").val() != ""){
	fetch('https://test.clerenet.com/product', {
		method: "POST",
		body: JSON.stringify({
    		"name": $("#add-name").val(),
    		"price": parseFloat($("#add-price").val()),
    		"currency": $("#add-currency").val()
		})
	})

	  .then(response => response.json())
	  .then(data => {
	  		var name = $("#add-name").val();
         	$('#addNewProduct').modal('hide');
         	Swal.fire( name +' was added to the product table!', '', 'success');
         	$("#add-name").val("");
         	$("#add-price").val("");
         	$("#add-currency").val("");
         	$(".table tbody").html("");
         	fetchAllProducts();
         	
	  });
	} else {
		Swal.fire('Please Fill All Required Fields!',
				'',
	  			'error');
	}
}

function updateProduct(){
	Swal.fire({
	  		  icon: 'question',
			  title: 'Do you want to save the changes?',
			  showDenyButton: true,
			  showCancelButton: false,
			  confirmButtonText: `Save`,
			  denyButtonText: `Don't save`,
			}).then((result) => {
			  if (result.isConfirmed) {
			  	fetch('https://test.clerenet.com/product', {
					method: "PUT",
					body: JSON.stringify({
						"id": productId,
			    		"name": $("#update-name").val(),
			    		"price": parseFloat($("#update-price").val()),
			    		"currency": $("#update-currency").val()
					})
				}).then((result) => {
				    Swal.fire('Saved!', '', 'success');
				    $('#updateProduct').modal('hide');
	         		$(".table tbody").html("");
	         		fetchAllProducts();
         		});
			  } else if (result.isDenied) {
			    Swal.fire('Changes are not saved', '', 'info');
			    $('#updateProduct').modal('hide');

			  }
			})
	
	  
}

function deleteProduct(id) {
	
	  	Swal.fire({
	  	  icon: 'warning',
		  title: 'Are you sure?',
		  text: "This item will be permanently deleted.",
		  showDenyButton: false,
		  showCancelButton: true,
		  confirmButtonText: `Yes, Delete`,
		  denyButtonText: `Cancel`,
		}).then((result) => {
		  /* Read more about isConfirmed, isDenied below */
		  if (result.isConfirmed) {
		  	fetch('https://test.clerenet.com/product/' + id, {
				method: "DELETE"
			}).then((result) => {
			    Swal.fire('Item Deleted!', '', 'success')
			    $(".table tbody").html("");
	         	fetchAllProducts();
         	});
		  } else {
		  	Swal.fire('Changes are not saved', '', 'info')
		  }
		})
	 
}

function rememberProductId(id) {
	productId = id;
	var currentProduct = allProducts.find(function(product) {
		return product.id == productId;
	});
	$("#update-name").val(currentProduct.name);
	$("#update-price").val(currentProduct.price);
	$("#update-currency").val(currentProduct.currency);
}

function createRow() {
	for (var product of allProducts) {
		product.currency = product.currency.toUpperCase();

		var row =  `<tr>
				      <th scope="row">${product.id}</th>
				      <td>${product.name}</td>
				      <td>${product.price} ${product.currency}</td>
				      <td class="action">
					      	<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#updateProduct" onclick="rememberProductId(` + product.id + `)">Update</button>
					      	<button type="button" class="btn btn-danger" onclick="deleteProduct(` + product.id + `)">Delete</button>
				      </td>
					</tr>`;
					$(".table tbody").append(row);
		}
}

fetchAllProducts();
