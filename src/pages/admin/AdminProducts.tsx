import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Star } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadProductImage } from '@/services/StorageService';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { useToast } from "@/hooks/use-toast";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';

import { Product, Category } from '@/lib/utils';

import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/services/ProductService';

import { fetchCategories } from '@/services/CategoryService';


const AdminProducts = () => {

  const [productList,setProductList] = useState<Product[]>([]);
  const [categories,setCategories] = useState<Category[]>([]);

  const [searchQuery,setSearchQuery] = useState('');

  const [isAddDialogOpen,setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen,setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen,setIsDeleteDialogOpen] = useState(false);

  const [selectedProduct,setSelectedProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading,setLoading] = useState(true);

  const {toast}=useToast();



  useEffect(()=>{

    loadData();

  },[]);



  const loadData = async()=>{

    try{

      setLoading(true);


      
      const [
  productsData,
  categoriesData

] = await Promise.all([

  fetchProducts({
    inStock: null,
    limit: 100
  }),

  fetchCategories()

]);



      console.log("DATABASE CATEGORIES:",categoriesData);



      setProductList(
        productsData.products || []
      );


      setCategories(
        categoriesData || []
      );



    }catch(error){


      console.log(error);


      toast({

        title:"Error",

        description:"Failed loading products or categories",

        variant:"destructive"

      });


    }finally{

      setLoading(false);

    }

  };





  const handleAddProduct = async(product:Product)=>{

  try{

    const productData = {
      ...product,
      category_id: product.category?.id
    };


    await createProduct(productData);

    await loadData();


    setIsAddDialogOpen(false);


    toast({
      title:"Product Added",
      description:`${product.name} created successfully`
    });


  }catch(error){

    console.log(error);

    toast({
      title:"Error",
      description:"Failed adding product",
      variant:"destructive"
    });

  }

};





  const handleEditProduct = async(updatedProduct:Product)=>{


    try{


      const {

        category,

        ...productData

      } = updatedProduct;



      await updateProduct(

        updatedProduct.id,

        {

          ...productData,

          category_id:category?.id

        }

      );



      await loadData();



      setIsEditDialogOpen(false);



      toast({

        title:"Updated",

        description:"Product updated successfully"

      });



    }catch(error){


      toast({

        title:"Error",

        description:"Failed updating product",

        variant:"destructive"

      });


    }


  };





  const handleDeleteProduct = async()=>{


    if(!selectedProduct) return;



    try{


      await deleteProduct(selectedProduct.id);



      await loadData();



      setIsDeleteDialogOpen(false);



      toast({

        title:"Deleted",

        description:"Product removed"

      });



    }catch(error){


      toast({

        title:"Error",

        description:"Failed deleting product",

        variant:"destructive"

      });


    }


  };





  const filteredProducts = productList.filter((product)=>{


    const search = searchQuery.toLowerCase();



    return (

      product.name?.toLowerCase().includes(search)

      ||

      product.description?.toLowerCase().includes(search)

    );


  });





  return (

<>
<Navbar/>


<main className="min-h-screen pt-24 pb-16">


<div className="container mx-auto px-4 md:px-6">


<h1 className="text-3xl font-bold mb-8">

Product Management

</h1>




<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">



<div className="md:col-span-1">

<AdminSidebar/>

</div>





<div className="md:col-span-2 lg:col-span-3 space-y-6">



<div className="flex justify-between gap-4">



<Input

placeholder="Search products..."

value={searchQuery}

onChange={(e)=>setSearchQuery(e.target.value)}

/>





<Dialog
open={isAddDialogOpen}
onOpenChange={setIsAddDialogOpen}
>


<DialogTrigger asChild>

<Button>

<Plus className="mr-2 h-4 w-4"/>

Add Product

</Button>

</DialogTrigger>



<DialogContent>


<DialogHeader>

<DialogTitle>

Add New Product

</DialogTitle>

</DialogHeader>



<ProductForm

categories={categories}

onSubmit={handleAddProduct}

/>


</DialogContent>



</Dialog>



</div>

<div className="border rounded-lg overflow-hidden">

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Image</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Price</TableHead>
      <TableHead>Stock</TableHead>
      <TableHead>Rating</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {filteredProducts.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={7}
          className="text-center py-8"
        >
          No products found
        </TableCell>
      </TableRow>
    ) : (
      filteredProducts.map((product) => (
        <TableRow key={product.id}>

          {/* IMAGE */}
          <TableCell>
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded object-cover"
            />
          </TableCell>


          {/* NAME */}
          <TableCell className="font-medium">
            {product.name}
          </TableCell>


          {/* CATEGORY */}
          <TableCell>
            {product.category?.name || "No category"}
          </TableCell>


          {/* PRICE */}
          <TableCell>
            RWF {Number(product.price).toLocaleString()}
          </TableCell>


          {/* STOCK */}
          <TableCell>
            {product.stock > 0 ? (
              <div className="flex flex-col">

                <span className="text-green-600 flex items-center font-medium">
                  <Check className="w-4 h-4 mr-1" />
                  In Stock
                </span>

                <span className="text-sm text-muted-foreground">
                  {product.stock} available
                </span>

              </div>
            ) : (
              <div className="flex flex-col">

                <span className="text-red-600 flex items-center font-medium">
                  <X className="w-4 h-4 mr-1" />
                  Out of Stock
                </span>

                <span className="text-sm text-muted-foreground">
                  0 available
                </span>

              </div>
            )}
          </TableCell>


          {/* RATING */}
          <TableCell>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              {Number(product.rating || 0).toFixed(1)}
            </div>
          </TableCell>


          {/* ACTIONS */}
          <TableCell>
            <div className="flex gap-2">

              {/* EDIT */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>


              {/* DELETE */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>

            </div>
          </TableCell>

        </TableRow>
      ))
    )}
  </TableBody>
</Table>

</div>



</div>

</div>

</div>


</main>





{/* EDIT PRODUCT */}

<Dialog

open={isEditDialogOpen}

onOpenChange={setIsEditDialogOpen}

>


<DialogContent>


<DialogHeader>

<DialogTitle>

Edit Product

</DialogTitle>

</DialogHeader>



{
selectedProduct &&

<ProductForm

product={selectedProduct}

categories={categories}

onSubmit={handleEditProduct}

/>

}



</DialogContent>


</Dialog>





{/* DELETE PRODUCT */}

<Dialog

open={isDeleteDialogOpen}

onOpenChange={setIsDeleteDialogOpen}

>


<DialogContent>


<DialogHeader>

<DialogTitle>

Delete Product

</DialogTitle>

</DialogHeader>


<p>

Are you sure you want to delete

<b> {selectedProduct?.name}</b> ?

</p>



<div className="flex justify-end gap-3 mt-5">


<Button

variant="outline"

onClick={()=>setIsDeleteDialogOpen(false)}

>

Cancel

</Button>



<Button

variant="destructive"

onClick={handleDeleteProduct}

>

Delete

</Button>



</div>



</DialogContent>


</Dialog>




<Footer/>


</>


);

};





interface ProductFormProps {

product?:Product;

categories:Category[];

onSubmit:(product:Product)=>void;

}




const ProductForm = ({


product,

categories,

onSubmit

}:ProductFormProps)=>{


const [uploadingImage, setUploadingImage] =
    useState(false);


const [formData, setFormData] = useState<Product>({
  id: product?.id || "",

  name: product?.name || "",

  description: product?.description || "",

  price: product?.price || 0,

  stock: product?.stock ?? 0,

  category: product?.category || null,

  image:
    product?.image ||
    "https://images.unsplash.com/photo-1518707495364-2ca69da1bc43",

  rating: product?.rating || 0,

  inStock: product?.inStock ?? false,

  featured: product?.featured ?? false,

  new: product?.new ?? false,

  discount: product?.discount || 0,

  specifications: product?.specifications || {}
});







const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]:
      name === "price" ||
      name === "rating" ||
      name === "stock"
        ? Number(value)
        : value
  }));
};






const submit=(e:React.FormEvent)=>{


e.preventDefault();


onSubmit(formData);


};







return (

<form onSubmit={submit} className="space-y-4">





<div>

<Label>

Product Name

</Label>


<Input

name="name"

value={formData.name}

onChange={handleChange}

/>


</div>







<div>


<Label>

Category

</Label>



<select

className="w-full border rounded-md h-10 px-3"


value={formData.category?.id || ""}


onChange={(e)=>{


const selected = categories.find(

(cat)=>cat.id===e.target.value

);



setFormData(prev=>({

...prev,

category:selected || null

}));



}}



required

>



<option value="">

Select Category

</option>



{

categories.map((category)=>(


<option

key={category.id}

value={category.id}

>

{category.name}

</option>


))


}



</select>


</div>







<div>

<Label>

Price

</Label>


<Input

type="number"

name="price"

value={formData.price}

onChange={handleChange}

/>

</div>








<div className="space-y-3">

  <Label>
    Product Image
  </Label>

  <Input
    type="file"
    accept="image/*"
    disabled={uploadingImage}
    onChange={async (e) => {

      const file = e.target.files?.[0];

      if (!file) return;

      try {

        setUploadingImage(true);

        const imageUrl =
          await uploadProductImage(file);

        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));

      } catch (error) {

        console.error(
          'Image upload failed:',
          error
        );

      } finally {

        setUploadingImage(false);

      }

    }}
  />

  {uploadingImage && (
    <p className="text-sm text-muted-foreground">
      Uploading image...
    </p>
  )}

  {formData.image && (
    <div className="mt-3">

      <img
        src={formData.image}
        alt="Product preview"
        className="w-32 h-32 rounded-md object-cover border"
      />

    </div>
  )}

</div>







<div>

<Label>

Description

</Label>


<textarea

name="description"

value={formData.description}

onChange={handleChange}

className="w-full border rounded-md p-2"

/>

</div>






<div>
  <Label>Stock Quantity</Label>

  <Input
    type="number"
    name="stock"
    min="0"
    value={formData.stock}
    onChange={handleChange}
  />

  <p className="text-sm text-muted-foreground mt-1">
    {formData.stock > 0
      ? `In Stock — ${formData.stock} available`
      : "Out of Stock"}
  </p>
</div>






<Button type="submit">


{
product ?

"Update Product"

:

"Add Product"

}


</Button>





</form>


);


};





export default AdminProducts;