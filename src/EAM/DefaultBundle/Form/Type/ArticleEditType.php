<?php
 
namespace EAM\DefaultBundle\Form\Type;
 
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
 
class ArticleEditType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', 'hidden')
            ->add('titre',          'text')
            ->add('publication',    'checkbox')
            ->add('contenu',        'textarea')
        ;
    }

    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'EAM\DefaultBundle\Form\Model\Article'
        ));
    }

    public function getName()
    {
        return 'eam_defaultbundle_articleedittype';
    }
}
