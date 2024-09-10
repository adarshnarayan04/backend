import moongose from moongose;

const catergorySchema = new moongose.Schema({
    name:{
        type: String,
        required: true
    }
},{timestamps: true});

export const Category = moongose.model('Category',catergorySchema);//good pratice to write both variable name and model name same

//store as categories in database ( if written 'categories' then it will be stored as 'categories'(same) in database)