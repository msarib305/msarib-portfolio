import type { SkillCategoryItem } from '@/data/skills'

interface SkillCategoryProps {
  category: SkillCategoryItem
}

export function SkillCategory({ category }: SkillCategoryProps) {
  return (
    <div className="skill-cat">
      <h4>{category.label}</h4>
      <ul>
        {category.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
