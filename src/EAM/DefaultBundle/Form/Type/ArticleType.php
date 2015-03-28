<?php

namespace EAM\DefaultBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

class ArticleType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('date',           'date')
            ->add('titre',          'text')
            ->add('auteur',         'text')
            ->add('image',          new ImageType(), array('required' => false))
            ->add('contenu',        'textarea')
        ;
        $factory = $builder->getFormFactory();

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function(FormEvent $event) use ($factory) {
                $article = $event->getData();

                if (null === $article) {
                    return;
                }

                if (false === $article->getPublication()) {
                    $event->getForm()->add(
                    $factory->createNamed('publication', 'checkbox', null, array('required' => false)));
                } else {
                    $event->getForm()->remove('publication');
                }
            }
        );
    }

    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'EAM\DefaultBundle\Entity\Article'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'eam_defaultbundle_article';
    }
}
