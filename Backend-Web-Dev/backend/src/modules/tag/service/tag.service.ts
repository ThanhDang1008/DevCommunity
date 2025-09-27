import Tag, { ITag } from "../schemes/tag.model";
import type {
  CreateTag,
  CreateChildTag,
  UpdateTag,
  UpdateChildTag,
} from "../interfaces/tag.interface";

class TagService {
  public async createTag(data: CreateTag): Promise<any> {
    try {
      const tag = await Tag.create({
        name: data.name,
        slug: data.slug,
        description: data.description || "",
      });
      return tag;
    } catch (error) {
      throw error;
    }
  }

  public async createChildTag(data: CreateChildTag): Promise<any> {
    try {
      const tag_child = await Tag.findByIdAndUpdate(
        data.tag_id,
        {
          $push: { child: data.child[0] },
        },
        {
          new: true,
          fields: { child: { $slice: -1 } }, // trả về dữ liệu mới sau khi update
        } // trả về dữ liệu mới sau khi update
      );
      return tag_child;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async getAllTag(): Promise<ITag[] | any> {
    try {
      const tags = await Tag.find().select("-child").exec();
      return tags;
    } catch (error) {
      throw error;
    }
  }

  public async getAllChildTag(tag_id: string): Promise<any> {
    try {
      const tag = await Tag.findOne({ _id: tag_id }).select("child").exec();
      if (!tag) return null;
      return tag?.child;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async updateTag(data: UpdateTag): Promise<any> {
    try {
      const tag = await Tag.findByIdAndUpdate(
        data._id,
        {
          name: data.name,
          description: data.description || "",
        },
        { new: true }
      ).select("-child");
      if (!tag) return null;
      return tag;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async updateChildTag(data: UpdateChildTag): Promise<any> {
    try {
      const tag = await Tag.findOneAndUpdate(
        { _id: data.tag_id, "child._id": data.child_tag_id },
        {
          $set: {
            "child.$.name": data.name,
            "child.$.description": data.description || "",
          },
        },
        {
          new: true,
          fields: { child: { $elemMatch: { _id: data.child_tag_id } } },
        }
      );
      if (!tag) return null;
      return tag?.child;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async deleteTag(slug: string): Promise<any> {
    try {
      const tag = await Tag.findOneAndDelete({ slug: slug });
      if (!tag) return null;
      //return tag;
      return true;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async deleteChildTag(slug: string, child_slug: string): Promise<any> {
    try {
      const tag = await Tag.findOneAndUpdate(
        { slug: slug },
        { $pull: { child: { slug: child_slug } } },
        { new: true }
      );
      if (!tag) return null;
      // console.log(tag);
      return true;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async checkExistChildTag(tag_id: string, slug: string): Promise<any> {
    try {
      const tag = await Tag.findOne({
        _id: tag_id,
        "child.slug": slug,
      }).select("child.$");
      if (!tag) return null;
      //console.log(tag);
      return tag;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async checkExistTag(slug: string): Promise<any> {
    try {
      const tag = await Tag.findOne({ slug: slug }).select("-child");
      if (!tag) return null;
      return tag;
    } catch (error) {
      return null;
      //throw
    }
  }

  public async getTagById(tag_id: string): Promise<any> {
    try {
      const tag = await Tag.findOne({ _id: tag_id }).select("-child");
      if (!tag) return null;
      return tag;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async getChildTagById(
    tag_id: string,
    child_tag_id: string
  ): Promise<any> {
    try {
      const tag = await Tag.findOne(
        {
          _id: tag_id,
          "child._id": child_tag_id,
        }
        // { "child.$": 1 }//giống select
      ).select("child.$");
      if (!tag) return null;
      return tag?.child;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async getAllChildTagBySlug(slug: string): Promise<any> {
    try {
      const tag = await Tag.findOne({ slug: slug }).select("child");
      if (!tag) return null;
      return tag?.child;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async getAllTagHeader(): Promise<any> {
    try {
      const tags = await Tag.find()
        .select("name slug -_id child.name child.slug")
        .exec();
      return tags;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async getTagBySlug(slug: string): Promise<any> {
    try {
      const tag = await Tag.findOne({ slug: slug })
      if (!tag) return null;
      return tag;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async getChildTagBySlug(slug: string,child_slug: string): Promise<any> {
    try {
      const tag = await Tag.findOne({
        slug: slug,
        "child.slug": child_slug,
      }).select("child.$");
      if (!tag) return null;
      return tag?.child[0];
    } catch (error) {
      return null;
      //throw error;
    }
  }
}

export const tagService: TagService = new TagService();
